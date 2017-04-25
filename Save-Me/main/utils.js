var Utils = (function () {
    function Utils() {
        this.expenses = [];
        this.dateFilter = new Date();
        this.clickAllExpensesToShow = false;
        this.budget = 3000;
        this.expenseListId = 'expense-list';
        this.expensePageDatepickerId = 'expense-page-datepicker';
        this.expensePageUpdateTheChangesId = 'expense-page-save-changes';
        this.expensePageDeleteExpenseId = 'expense-page-delete-expense';
        this.expensePageSelectId = 'expense-page-select-type';
        this.newExpensePageSelectId = 'new-expense-page-select-type';
        this.newExpensePageDatepickerId = 'new-expense-page-datepicker';
        this.newExpensePageSaveTheChangesId = 'new-expense-page-save-changes';
        this.addNewExpenseId = 'add-new-expense';
        this.refreshHomePageId = 'refresh-home-page';
        this.dateFilterId = 'date-filter-display';
        this.dateFilterLeftArrowId = 'data-filter-left';
        this.dateFilterRightArrowId = 'data-filter-right';
        this.barLineAnimatedId = 'bar-line-animated';
        this.pieChartId = 'pie-chart';
        this.pieChartTabId = 'pie-chart-tab';
        this.barLineAnimatedTabId = 'bar-line-animated-tab';
        this.statisticsPageId = 'statistics-page';
        this.statisticsTabsId = 'statistics-tabs';
        this.datepickerService = new DatepickerService();
        this.expenseService = new ExpenseService();
        this.htmlService = new HtmlService();
        this.databaseService = new DatabaseService();
        this.graphService = new GraphService();
        this.commonService = new CommonService();
        this.registerToEvents();
    }
    Utils.prototype.load = function () {
        var _this = this;
        this.showLoadMsg();
        this.databaseService.getAllExpenses(function (expenses) {
            _this.expenses = expenses;
            _this.loadJqueryComponents();
            _this.loadToView();
            _this.hideLoadMsg();
        });
    };
    Utils.prototype.addExpense = function (expense) {
        var _this = this;
        this.showLoadMsg();
        this.databaseService.addExpenseToDB(expense, function (event) {
            _this.expenses.push(expense);
            _this.addExpenseToView(expense);
            _this.handleExpenseListChange();
            _this.hideLoadMsg();
        });
    };
    Utils.prototype.removeExpense = function (expense) {
        var _this = this;
        this.showLoadMsg();
        this.databaseService.removeExpenseFromDB(expense, function () {
            _this.expenses.splice(_this.expenses.indexOf(expense), 1);
            _this.removeExpenseFromView(expense);
            _this.handleExpenseListChange();
            _this.hideLoadMsg();
        });
    };
    Utils.prototype.updateExpense = function (oldExpense) {
        var _this = this;
        this.showLoadMsg();
        var updatedExpense = this.expenseService.getUpdatedExpense();
        updatedExpense.id = this.displayedExpense.id;
        this.databaseService.updateExpenseToDB(updatedExpense, function () {
            _this.expenses.splice(_this.expenses.indexOf(oldExpense), 1);
            _this.expenses.push(updatedExpense);
            _this.removeExpenseFromView(_this.displayedExpense);
            _this.addExpenseToView(updatedExpense);
            _this.handleExpenseListChange();
            _this.hideLoadMsg();
        });
    };
    Utils.prototype.addExpenseToView = function (expense) {
        var _this = this;
        var expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense);
        var expenseElementHtml = $(expenseStringHtml);
        expenseElementHtml.click(function () {
            _this.handleExpenseSelected(expense);
        });
        if (this.clickAllExpensesToShow || this.commonService.isTheSameDate(expense.date, this.dateFilter)) {
            $('#' + this.expenseListId).append(expenseElementHtml);
        }
    };
    Utils.prototype.removeExpenseFromView = function (expense) {
        var elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    };
    Utils.prototype.setPriceInformation = function () {
        var totalExpensesPrice = 0;
        var filterdExpenses = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
        filterdExpenses.forEach(function (expense) {
            totalExpensesPrice += Number(expense.price);
        });
        this.htmlService.setPriceHoverReportTemplate(this.budget, totalExpensesPrice);
    };
    Utils.prototype.filterExpenses = function (date) {
        var _this = this;
        var filterdExpenses = [];
        $.each(this.expenses, function (idx, itm) {
            if (_this.commonService.isTheSameDate(itm.date, date)) {
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
    Utils.prototype.registerToEvents = function () {
        var _this = this;
        this.registerPageLoadEvent();
        this.registerDateFilterEvents();
        this.registerStatisticsPageEvents();
        $('#' + this.refreshHomePageId).click(function () {
            location.reload();
        });
        $('#' + this.expensePageUpdateTheChangesId).click(function () {
            _this.updateExpense(_this.displayedExpense);
        });
        $('#' + this.expensePageDeleteExpenseId).click(function () {
            _this.removeExpense(_this.displayedExpense);
        });
        $('#' + this.addNewExpenseId).click(function () {
            _this.expenseService.setDefaultExpenseToNewExpensePage();
        });
        var isFromNewExpensePage = true;
        $('#' + this.newExpensePageSaveTheChangesId).click(function () {
            var expense = _this.expenseService.getUpdatedExpense(isFromNewExpensePage);
            _this.addExpense(expense);
        });
    };
    Utils.prototype.registerDateFilterEvents = function () {
        var _this = this;
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
    Utils.prototype.registerStatisticsPageEvents = function () {
        var _this = this;
        var selector = '#' + this.statisticsPageId;
        var tabSelected;
        var expensesToPieChart;
        $(document).on("pageshow", selector, function () {
            if (tabSelected === _this.pieChartTabId) {
                expensesToPieChart = _this.clickAllExpensesToShow ? _this.expenses : _this.filterExpenses(_this.dateFilter);
                _this.graphService.replotPieChartsEnhancedLegend(_this.pieChartId, expensesToPieChart);
            }
            else {
                _this.graphService.replotBarLineAnimatedMonthly(_this.barLineAnimatedId, _this.expenses);
            }
        });
        $(window).on("orientationchange", function (event) {
            if (tabSelected === _this.barLineAnimatedTabId) {
                _this.graphService.replotBarLineAnimatedMonthly(_this.barLineAnimatedId, _this.expenses);
            }
            else if (tabSelected === _this.pieChartTabId) {
                expensesToPieChart = _this.clickAllExpensesToShow ? _this.expenses : _this.filterExpenses(_this.dateFilter);
                _this.graphService.replotPieChartsEnhancedLegend(_this.pieChartId, expensesToPieChart);
            }
        });
        $('#' + this.barLineAnimatedTabId).click(function () {
            tabSelected = _this.barLineAnimatedTabId;
            _this.graphService.replotBarLineAnimatedMonthly(_this.barLineAnimatedId, _this.expenses);
        });
        $('#' + this.pieChartTabId).click(function () {
            tabSelected = _this.pieChartTabId;
            expensesToPieChart = _this.clickAllExpensesToShow ? _this.expenses : _this.filterExpenses(_this.dateFilter);
            _this.graphService.replotPieChartsEnhancedLegend(_this.pieChartId, expensesToPieChart);
        });
    };
    Utils.prototype.registerPageLoadEvent = function () {
        var _this = this;
        $(document).on('pagebeforecreate', '[data-role="page"]', function () {
            var interval = setInterval(function () {
                _this.showLoadMsg();
                clearInterval(interval);
            }, 1);
        });
        $(document).on('pageshow', '[data-role="page"]', function () {
            var interval = setInterval(function () {
                $.mobile.loading('hide');
                clearInterval(interval);
            }, 300);
        });
    };
    Utils.prototype.loadToView = function () {
        var _this = this;
        var filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
        var ebumValues = this.commonService.getEnumValues(ExpenseType);
        $.each(ebumValues, function (index, expenseType) {
            _this.addOptionTypeOfExpense(expenseType);
        });
        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    };
    Utils.prototype.loadExpensesToView = function (expenses) {
        var _this = this;
        $('#' + this.expenseListId + ' > li').remove();
        $.each(expenses, function (index, expense) {
            _this.addExpenseToView(expense);
        });
        this.handleExpenseListChange();
    };
    Utils.prototype.loadJqueryComponents = function () {
        this.datepickerService.loadDatepicker(this.expensePageDatepickerId);
        $('#' + this.expensePageSelectId).selectmenu();
        this.datepickerService.loadDatepicker(this.newExpensePageDatepickerId);
        $('#' + this.newExpensePageSelectId).selectmenu();
        $('#' + this.addNewExpenseId).draggable();
        $('#' + this.statisticsTabsId).tabs();
    };
    Utils.prototype.showLoadMsg = function () {
        $.mobile.loading('show', {
            textVisible: true,
            theme: 'z',
            html: "<div class=\"loading\">\n                                <span class='ui-bar ui-overlay-c ui-corner-all loader'><img src='assets/images/gears.gif'/>\n                                    <h2>loading...</h2>\n                                </span>\n                           </div>"
        });
    };
    Utils.prototype.hideLoadMsg = function () {
        $.mobile.loading('hide');
    };
    Utils.prototype.handleArrowDateFilterClicked = function (isLeft) {
        this.clickAllExpensesToShow = false;
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
        this.setPriceInformation();
        $('#' + this.expenseListId).listview("refresh");
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
    return Utils;
}());
//# sourceMappingURL=utils.js.map