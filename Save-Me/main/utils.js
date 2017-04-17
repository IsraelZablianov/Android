var Utils = (function () {
    function Utils() {
        this.expenses = [];
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
            _this.addExpenseToView(expense);
            _this.handleExpenseListChange(expense);
        });
    };
    Utils.prototype.removeExpense = function (expense) {
        var _this = this;
        this.databaseService.removeExpenseFromDB(expense, function () {
            _this.expenses.splice(_this.expenses.indexOf(expense), 1);
            _this.removeExpenseFromView(expense);
            _this.handleExpenseListChange(expense);
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
            _this.handleExpenseListChange(oldExpense);
        });
    };
    Utils.prototype.addExpenseToView = function (expense) {
        var _this = this;
        this.expenses.push(expense);
        var expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense);
        var expenseHtmlElement = $(expenseStringHtml);
        expenseHtmlElement.on('click', function () {
            _this.handleExpenseSelected(expense);
        });
        $('#' + this.expenseListId).append(expenseHtmlElement);
        this.htmlService.sortUL(this.expenseListId, SortType.Date);
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
    };
    Utils.prototype.loadToView = function () {
        var _this = this;
        $.each(this.expenses, function (index, expense) {
            _this.addExpenseToView(expense);
        });
        this.handleExpenseListChange();
        var ebumValues = Object
            .keys(ExpenseType)
            .filter(function (key) { return _this.isIndex(key); })
            .map(function (index) { return Number(index); });
        $.each(ebumValues, function (index, expenseType) {
            _this.addOptionTypeOfExpense(expenseType);
        });
    };
    Utils.prototype.handleExpenseListChange = function (expense) {
        var selector = '#' + this.expenseListId;
        $(selector).listview("refresh");
    };
    Utils.prototype.handleExpenseSelected = function (expense) {
        this.displayedExpense = expense;
        this.expenseService.setSelectedExpense(expense);
    };
    Utils.prototype.isIndex = function (key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    };
    Utils.prototype.addOptionTypeOfExpense = function (optionType) {
        var optionHtmlString = this.htmlService.getOptionTypeExpenseTemplate(optionType);
        $('#' + this.expensePageSelectId).append(optionHtmlString);
        $('#' + this.newExpensePageSelectId).append(optionHtmlString);
    };
    return Utils;
}());
//# sourceMappingURL=utils.js.map