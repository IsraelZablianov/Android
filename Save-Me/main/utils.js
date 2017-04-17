var Utils = (function () {
    function Utils() {
        this.expenses = [];
        this.dateFilter = new Date();
        this.clickAllExpensesToShow = false;
        this.expenseListId = 'expense-list';
        this.expensePageDatepickerId = 'expense-page-datepicker';
        this.expensePageSaveChangesId = 'expense-page-save-changes';
        this.expensePageDeleteExpenseId = 'expense-page-delete-expense';
        this.expensePageSelectId = 'expense-page-select-type';
        this.newExpensePageSelectId = 'new-expense-page-select-type';
        this.newExpensePageDatepickerId = 'new-expense-page-datepicker';
        this.newExpensePageSaveChangesId = 'new-expense-page-save-changes';
        this.addNewExpenseId = 'add-new-expense';
        this.refreshHomePageId = 'refresh-home-page';
        this.dateFilterId = 'date-filter-display';
        this.dateFilterLeftArrowId = 'data-filter-left';
        this.dateFilterRightArrowId = 'data-filter-right';
        this.datepickerService = new DatepickerService();
        this.expenseService = new ExpenseService();
        this.htmlService = new HtmlService();
        this.databaseService = new DatabaseService();
        this.registerToEvents();
    }
    Utils.prototype.load = function () {
        var _this = this;
        this.databaseService.getAllExpenses(function (expenses) {
            _this.expenses = expenses;
            _this.loadJqueryComponents();
            _this.loadToView();
        });
    };
    Utils.prototype.addExpense = function (expense) {
        var _this = this;
        this.databaseService.addExpenseToDB(expense, function (event) {
            _this.expenses.push(expense);
            _this.addExpenseToView(expense);
            _this.handleExpenseListChange();
        });
    };
    Utils.prototype.removeExpense = function (expense) {
        var _this = this;
        this.databaseService.removeExpenseFromDB(expense, function () {
            _this.expenses.splice(_this.expenses.indexOf(expense), 1);
            _this.removeExpenseFromView(expense);
            _this.handleExpenseListChange();
        });
    };
    Utils.prototype.updateExpense = function (oldExpense) {
        var _this = this;
        var updatedExpense = this.expenseService.getUpdatedExpense();
        updatedExpense.id = this.displayedExpense.id;
        this.databaseService.updateExpenseToDB(updatedExpense, function () {
            _this.expenses.splice(_this.expenses.indexOf(oldExpense), 1);
            _this.expenses.push(updatedExpense);
            _this.removeExpenseFromView(_this.displayedExpense);
            _this.addExpenseToView(updatedExpense);
            _this.handleExpenseListChange();
        });
    };
    Utils.prototype.addExpenseToView = function (expense) {
        var _this = this;
        var expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense);
        var expenseHtmlElement = $(expenseStringHtml);
        expenseHtmlElement.on('click', function () {
            _this.handleExpenseSelected(expense);
        });
        if (this.clickAllExpensesToShow || this.isTheSameDate(expense.date, this.dateFilter)) {
            $('#' + this.expenseListId).append(expenseHtmlElement);
        }
    };
    Utils.prototype.removeExpenseFromView = function (expense) {
        var elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    };
    Utils.prototype.loadJqueryComponents = function () {
        this.datepickerService.loadDatepicker(this.expensePageDatepickerId);
        $('#' + this.expensePageSelectId).selectmenu();
        this.datepickerService.loadDatepicker(this.newExpensePageDatepickerId);
        $('#' + this.newExpensePageSelectId).selectmenu();
        this.htmlService.activateDragAndDrop(this.addNewExpenseId);
    };
    Utils.prototype.loadExpensesToView = function (expenses) {
        var _this = this;
        $('#' + this.expenseListId + ' > li').remove();
        $.each(expenses, function (index, expense) {
            _this.addExpenseToView(expense);
        });
        this.handleExpenseListChange();
    };
    Utils.prototype.loadToView = function () {
        var _this = this;
        var filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
        var ebumValues = Object
            .keys(ExpenseType)
            .filter(function (key) { return _this.isIndex(key); })
            .map(function (index) { return Number(index); });
        $.each(ebumValues, function (index, expenseType) {
            _this.addOptionTypeOfExpense(expenseType);
        });
        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    };
    Utils.prototype.registerToEvents = function () {
        var _this = this;
        $(document).on('pagebeforecreate', '[data-role="page"]', function () {
            var interval = setInterval(function () {
                $.mobile.loading('show', {
                    text: 'foo',
                    textVisible: true,
                    theme: 'z',
                    html: "<span class='ui-bar ui-overlay-c ui-corner-all loader'><img src='assets/images/gears.gif' /><h2>loading...</h2></span>"
                });
                clearInterval(interval);
            }, 1);
        });
        $(document).on('pageshow', '[data-role="page"]', function () {
            var interval = setInterval(function () {
                $.mobile.loading('hide');
                clearInterval(interval);
            }, 300);
        });
        $('#' + this.refreshHomePageId).click(function () {
            location.reload();
        });
        $('#' + this.expensePageSaveChangesId).click(function () {
            _this.updateExpense(_this.displayedExpense);
        });
        $('#' + this.expensePageDeleteExpenseId).click(function () {
            _this.removeExpense(_this.displayedExpense);
        });
        $('#' + this.addNewExpenseId).click(function () {
            _this.expenseService.setDefaultExpenseToNewExpensePage();
        });
        $('#' + this.newExpensePageSaveChangesId).click(function () {
            var isFromNewExpensePage = true;
            var expense = _this.expenseService.getUpdatedExpense(isFromNewExpensePage);
            _this.addExpense(expense);
        });
        var isLeft = true;
        $('#' + this.dateFilterLeftArrowId).click(function () {
            _this.handleArrowDateFilterClicked(isLeft);
        });
        $('#' + this.dateFilterRightArrowId).click(function () {
            _this.handleArrowDateFilterClicked(!isLeft);
        });
        $('#' + this.dateFilterId).click(function () {
            _this.handleExpenseDateClicked();
        });
    };
    Utils.prototype.filterExpenses = function (date) {
        var _this = this;
        var filterdExpenses = [];
        $.each(this.expenses, function (idx, itm) {
            if (_this.isTheSameDate(itm.date, date)) {
                filterdExpenses.push(itm);
            }
        });
        return filterdExpenses;
    };
    Utils.prototype.addOptionTypeOfExpense = function (optionType) {
        var optionHtmlString = this.htmlService.getOptionTypeExpenseTemplate(optionType);
        $('#' + this.expensePageSelectId).append(optionHtmlString);
        $('#' + this.newExpensePageSelectId).append(optionHtmlString);
    };
    Utils.prototype.handleArrowDateFilterClicked = function (isLeft) {
        var newMonth;
        var newYear = this.dateFilter.getFullYear();
        if (!isLeft) {
            newMonth = this.dateFilter.getMonth() + 1;
            if (newMonth === 12) {
                newMonth = 0;
                newYear = this.dateFilter.getFullYear() + 1;
            }
        }
        else {
            newMonth = this.dateFilter.getMonth() - 1;
            if (newMonth === 0) {
                newMonth = 11;
                newYear = this.dateFilter.getFullYear() - 1;
            }
        }
        this.dateFilter.setMonth(newMonth);
        this.dateFilter.setFullYear(newYear);
        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
        var filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
    };
    Utils.prototype.handleExpenseListChange = function (expenses) {
        this.htmlService.sortUL(this.expenseListId, SortType.Date);
        var selector = '#' + this.expenseListId;
        $(selector).listview("refresh");
    };
    Utils.prototype.handleExpenseDateClicked = function () {
        this.clickAllExpensesToShow = !this.clickAllExpensesToShow;
        if (this.clickAllExpensesToShow) {
            this.loadExpensesToView(this.expenses);
            $('#' + this.dateFilterId).text('All Expenses');
            this.clickAllExpensesToShow = true;
        }
        else {
            var filteredExpenses = this.filterExpenses(this.dateFilter);
            this.loadExpensesToView(filteredExpenses);
            $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
            this.clickAllExpensesToShow = false;
        }
    };
    Utils.prototype.handleExpenseSelected = function (expense) {
        this.displayedExpense = expense;
        this.expenseService.setSelectedExpense(expense);
    };
    Utils.prototype.isTheSameDate = function (date1, date2) {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    };
    Utils.prototype.isIndex = function (key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    };
    return Utils;
}());
//# sourceMappingURL=utils.js.map