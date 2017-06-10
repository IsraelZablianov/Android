/*
* Utils is the main class that manages the application.
* All the business logic, event registration and more, are been handled here.
* */
var Utils = (function () {
    function Utils() {
        this.expenses = [];
        this.dateFilter = new Date();
        this.clickAllExpensesToShow = false;
        this.datepickerService = new DatepickerService();
        this.expenseService = new ExpenseService();
        this.htmlService = new HtmlService();
        this.databaseService = new DatabaseService();
        this.graphService = new GraphService();
        this.commonService = new CommonService();
        this.settingsService = new SettingsService();
    }
    /*
    * The main method to activate the app
    * */
    Utils.prototype.load = function () {
        var _this = this;
        this.registerToEvents();
        this.loadSettings(function () {
            _this.showLoadMsg();
            _this.databaseService.getAllExpenses(function (expenses) {
                _this.expenses = expenses;
                _this.loadComponents();
                _this.loadAllToView();
                _this.hideLoadMsg();
            });
        });
    };
    /*
    * Add expense to everywhere (Database, UI, innerCollections...)
    * */
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
    /*
    * Remove expense from everywhere (Database, UI, innerCollections...)
    * */
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
    /*
    * Update expense everywhere (Database, UI, innerCollections...)
    * */
    Utils.prototype.updateExpense = function (oldExpense) {
        var _this = this;
        this.showLoadMsg();
        var updatedExpense = this.expenseService.getExpenseFromView();
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
    /*
    * Loads all the necessary elements to html
    * */
    Utils.prototype.loadAllToView = function () {
        var _this = this;
        var filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
        var ebumValues = this.commonService.getEnumNumericKeys(ExpenseType);
        $.each(ebumValues, function (index, expenseType) {
            _this.addExpenseTypeOption(expenseType);
        });
        $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    };
    /*
    * Loads the expenses that passed as param to the list of expenses
    * */
    Utils.prototype.loadExpensesToView = function (expenses) {
        var _this = this;
        $("#" + IdService.expenseListId + " > li").remove();
        $.each(expenses, function (index, expense) {
            _this.addExpenseToView(expense);
        });
        this.handleExpenseListChange();
    };
    /*
    * Load JQuery components
    * */
    Utils.prototype.loadComponents = function () {
        this.datepickerService.loadDatepicker(IdService.expensePageDatepickerId);
        this.datepickerService.loadDatepicker(IdService.newExpensePageDatepickerId);
        $("#" + IdService.expensePageSelectId).selectmenu();
        $("#" + IdService.newExpensePageSelectId).selectmenu();
        $('#' + IdService.settingsCurrencyId).selectmenu();
        $("#" + IdService.statisticsTabsId).tabs();
        /* Android webWiew Can't handle that */
        // $("#" + IdService.addNewExpenseId).draggable();
    };
    /*
    * Load user settings
    * */
    Utils.prototype.loadSettings = function (callback) {
        var _this = this;
        this.showLoadMsg();
        this.settingsService.loadSettings(function () {
            _this.htmlService.setGreetingMessage(_this.settingsService.getSettings().name);
            _this.hideLoadMsg();
            callback();
        });
    };
    /*
    * Add single expense to view
    * */
    Utils.prototype.addExpenseToView = function (expense) {
        var _this = this;
        var expenseStringHtml = this.htmlService.getExpenseHtmlTemplate(expense, this.settingsService.getSettings().currency);
        var expenseElementHtml = $(expenseStringHtml);
        expenseElementHtml.click(function () {
            _this.handleExpenseSelected(expense);
        });
        if (this.clickAllExpensesToShow || this.commonService.isTheSameMonthAndYear(expense.date, this.dateFilter)) {
            $("#" + IdService.expenseListId).append(expenseElementHtml);
        }
    };
    /*
    * Remove single expense from view
    * */
    Utils.prototype.removeExpenseFromView = function (expense) {
        var elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    };
    /*
    * Set price information according to current budget and total expenses
    * */
    Utils.prototype.setPriceInformation = function () {
        var totalExpensesPrice = 0;
        var filterdExpenses = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
        filterdExpenses.forEach(function (expense) {
            totalExpensesPrice += Number(expense.price);
        });
        var budget = this.settingsService.getSettings().budget;
        this.htmlService.setPriceHoverReportTemplate(budget, totalExpensesPrice);
    };
    /*
    * filter expenses according to given month and year
    * */
    Utils.prototype.filterExpenses = function (date) {
        var _this = this;
        var filterdExpenses = [];
        $.each(this.expenses, function (idx, itm) {
            if (_this.commonService.isTheSameMonthAndYear(itm.date, date)) {
                filterdExpenses.push(itm);
            }
        });
        return filterdExpenses;
    };
    /*
    * Adding option for expense type to 'select' html element
    * */
    Utils.prototype.addExpenseTypeOption = function (optionType) {
        var optionHtmlString = this.htmlService.getExpenseTypeOptionTemplate(optionType);
        $("#" + IdService.expensePageSelectId).append(optionHtmlString);
        $("#" + IdService.newExpensePageSelectId).append(optionHtmlString);
    };
    Utils.prototype.showLoadMsg = function () {
        $.mobile.loading("show", {
            textVisible: true,
            theme: "z",
            html: "<div class=\"loading\">\n                                <span class=\"ui-bar ui-overlay-c ui-corner-all loader\"><img src=\"assets/images/gears.gif\"/>\n                                    <h2>loading...</h2>\n                                </span>\n                           </div>"
        });
    };
    Utils.prototype.hideLoadMsg = function () {
        $.mobile.loading("hide");
    };
    /*
    * Register to all system events
    * */
    Utils.prototype.registerToEvents = function () {
        this.registerPageLoadEvent();
        this.registerDateFilterEvents();
        this.registerStatisticsPageEvents();
        this.registerToSettingsEvents();
        this.registerExpensesEvents();
    };
    /*
    * Register to events related to some expense (Add, Remove, Update..)
    * */
    Utils.prototype.registerExpensesEvents = function () {
        var _this = this;
        $("#" + IdService.expensePageUpdateTheChangesId).click(function () {
            _this.updateExpense(_this.displayedExpense);
        });
        $("#" + IdService.expensePageDeleteExpenseId).click(function () {
            _this.removeExpense(_this.displayedExpense);
        });
        $("#" + IdService.addNewExpenseId).click(function () {
            _this.expenseService.setDefaultExpenseToNewExpensePage();
        });
        var isFromNewExpensePage = true;
        $("#" + IdService.newExpensePageSaveTheChangesId).click(function () {
            var expense = _this.expenseService.getExpenseFromView(isFromNewExpensePage);
            _this.addExpense(expense);
        });
    };
    /*
    * Register to events related to change of settings
    * */
    Utils.prototype.registerToSettingsEvents = function () {
        var _this = this;
        $("#" + IdService.settingsPageBtnId).click(function () {
            _this.settingsService.setSettingsToView();
        });
        $("#" + IdService.settingsSaveTheChangesId).click(function () {
            _this.showLoadMsg();
            _this.settingsService.saveChanges(function () {
                _this.setPriceInformation();
                _this.htmlService.setGreetingMessage(_this.settingsService.getSettings().name);
                _this.hideLoadMsg();
            });
        });
        $("#" + IdService.settingsResetApp).click(function () {
            _this.showLoadMsg();
            _this.databaseService.deleteAllExpenses(function () {
                _this.expenses = [];
                _this.displayedExpense = new Expense();
                _this.loadExpensesToView(_this.expenses);
                _this.setPriceInformation();
                _this.hideLoadMsg();
            });
        });
    };
    /*
    * Register to date filter events (Arrow filters)
    * */
    Utils.prototype.registerDateFilterEvents = function () {
        var _this = this;
        var isLeft = true;
        $("#" + IdService.dateFilterLeftArrowId).click(function () {
            _this.handleArrowDateFilterClicked(isLeft);
        });
        $("#" + IdService.dateFilterRightArrowId).click(function () {
            _this.handleArrowDateFilterClicked(!isLeft);
        });
        $("#" + IdService.dateFilterId).click(function () {
            _this.handleExpenseDateFilterClicked();
        });
    };
    /*
    * Register to statistics page events
    * */
    Utils.prototype.registerStatisticsPageEvents = function () {
        var _this = this;
        var selector = "#" + IdService.statisticsPageId;
        var tabSelected;
        var expensesToPieChart;
        // Create charts only if page is shown
        $(document).on("pageshow", selector, function () {
            if (tabSelected === IdService.pieChartTabId) {
                expensesToPieChart = _this.clickAllExpensesToShow ? _this.expenses : _this.filterExpenses(_this.dateFilter);
                _this.graphService.replotPieChartsEnhancedLegend(IdService.pieChartId, expensesToPieChart);
            }
            else {
                var currency = _this.settingsService.getSettings().currency;
                _this.graphService.replotBarLineAnimatedMonthly(IdService.barLineAnimatedId, _this.expenses, currency);
            }
        });
        $("#" + IdService.barLineAnimatedTabId).click(function () {
            tabSelected = IdService.barLineAnimatedTabId;
            var currency = _this.settingsService.getSettings().currency;
            _this.graphService.replotBarLineAnimatedMonthly(IdService.barLineAnimatedId, _this.expenses, currency);
        });
        $("#" + IdService.pieChartTabId).click(function () {
            tabSelected = IdService.pieChartTabId;
            expensesToPieChart = _this.clickAllExpensesToShow ? _this.expenses : _this.filterExpenses(_this.dateFilter);
            _this.graphService.replotPieChartsEnhancedLegend(IdService.pieChartId, expensesToPieChart);
        });
    };
    /*
    * Register events related to page loading and initializing
    * */
    Utils.prototype.registerPageLoadEvent = function () {
        var _this = this;
        $(document).on("pagebeforecreate", "[data-role='page']", function () {
            var interval = setInterval(function () {
                _this.showLoadMsg();
                clearInterval(interval);
            }, 1);
        });
        $(document).on("pageshow", "[data-role='page']", function () {
            var interval = setInterval(function () {
                _this.hideLoadMsg();
                clearInterval(interval);
            }, 300);
        });
    };
    /* Handle events */
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
        $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
        var filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
    };
    Utils.prototype.handleExpenseListChange = function (expenses) {
        this.htmlService.sortUL(IdService.expenseListId, SortType.Date);
        this.setPriceInformation();
        $("#" + IdService.expenseListId).listview("refresh");
    };
    Utils.prototype.handleExpenseDateFilterClicked = function () {
        this.clickAllExpensesToShow = !this.clickAllExpensesToShow;
        if (this.clickAllExpensesToShow) {
            this.loadExpensesToView(this.expenses);
            $("#" + IdService.dateFilterId).text("All Expenses");
            this.clickAllExpensesToShow = true;
        }
        else {
            var filteredExpenses = this.filterExpenses(this.dateFilter);
            this.loadExpensesToView(filteredExpenses);
            $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
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