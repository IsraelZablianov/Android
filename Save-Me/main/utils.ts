/*
* Utils is the main class that manages the application.
* All the business logic, event registration and more, are been handled here.
* */

class Utils {
    private expenses: Expense[] = [];
    private displayedExpense: Expense;
    private dateFilter: Date = new Date();
    private clickAllExpensesToShow: boolean = false;

    private datepickerService: DatepickerService = new DatepickerService();
    private expenseService: ExpenseService = new ExpenseService();
    private htmlService: HtmlService = new HtmlService();
    private databaseService: DatabaseService = new DatabaseService();
    private graphService: GraphService = new GraphService();
    private commonService: CommonService = new CommonService();
    private settingsService: SettingsService = new SettingsService();

    /*
    * The main method to activate the app
    * */
    load(): void {
        this.registerToEvents();
        this.loadSettings(()=> {
            this.showLoadMsg();
            this.databaseService.getAllExpenses((expenses)=>{
                this.expenses = expenses;
                this.loadComponents();
                this.loadAllToView();
                this.hideLoadMsg();
            });
        });
    }

    /*
    * Add expense to everywhere (Database, UI, innerCollections...)
    * */
    addExpense(expense: Expense): void {
        this.showLoadMsg();
        this.databaseService.addExpenseToDB(expense, (event)=>{
            this.expenses.push(expense);
            this.addExpenseToView(expense);
            this.handleExpenseListChange();
            this.hideLoadMsg();
        });
    }

    /*
    * Remove expense from everywhere (Database, UI, innerCollections...)
    * */
    removeExpense(expense: Expense): void {
        this.showLoadMsg();
        this.databaseService.removeExpenseFromDB(expense, ()=> {
            this.expenses.splice(this.expenses.indexOf(expense), 1);
            this.removeExpenseFromView(expense);
            this.handleExpenseListChange();
            this.hideLoadMsg();
        });
    }

    /*
    * Update expense everywhere (Database, UI, innerCollections...)
    * */
    updateExpense(oldExpense: Expense): void {
        this.showLoadMsg();
        let updatedExpense = this.expenseService.getExpenseFromView();
        updatedExpense.id = this.displayedExpense.id;

        this.databaseService.updateExpenseToDB(updatedExpense, ()=>{
            this.expenses.splice(this.expenses.indexOf(oldExpense), 1);
            this.expenses.push(updatedExpense);
            this.removeExpenseFromView(this.displayedExpense);
            this.addExpenseToView(updatedExpense);
            this.handleExpenseListChange();
            this.hideLoadMsg();
        });
    }

    /*
    * Loads all the necessary elements to html
    * */
    private loadAllToView(): void {
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);

        let ebumValues = this.commonService.getEnumNumericKeys(ExpenseType);
        $.each(ebumValues, (index, expenseType)=>{
            this.addExpenseTypeOption(expenseType);
        });

        $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    }

    /*
    * Loads the expenses that passed as param to the list of expenses
    * */
    private loadExpensesToView(expenses: Expense[]): void {
        $("#" + IdService.expenseListId + " > li").remove();
        $.each(expenses, (index, expense)=> {
            this.addExpenseToView(expense);
        });

        this.handleExpenseListChange();
    }

    /*
    * Load JQuery components
    * */
    private loadComponents(): void {
        this.datepickerService.loadDatepicker(IdService.expensePageDatepickerId);
        this.datepickerService.loadDatepicker(IdService.newExpensePageDatepickerId);
        $("#" + IdService.expensePageSelectId).selectmenu();
        $("#" + IdService.newExpensePageSelectId).selectmenu();
        $('#' + IdService.settingsCurrencyId).selectmenu();
        $( "#" + IdService.statisticsTabsId).tabs();

        /* Android webWiew Can't handle that */
        // $("#" + IdService.addNewExpenseId).draggable();
    }

    /*
    * Load user settings
    * */
    private loadSettings(callback): void {
        this.showLoadMsg();
        this.settingsService.loadSettings(()=>{
            this.htmlService.setGreetingMessage(this.settingsService.getSettings().name);
            this.hideLoadMsg();
            callback();
        });
    }

    /*
    * Add single expense to view
    * */
    private addExpenseToView(expense: Expense): void {
        let expenseStringHtml = this.htmlService.getExpenseHtmlTemplate(expense, this.settingsService.getSettings().currency);
        let expenseElementHtml = $(expenseStringHtml);
        expenseElementHtml.click(() => {
            this.handleExpenseSelected(expense)
        });

        if(this.clickAllExpensesToShow || this.commonService.isTheSameMonthAndYear(expense.date, this.dateFilter)){
            $("#" + IdService.expenseListId).append(expenseElementHtml);
        }
    }

    /*
    * Remove single expense from view
    * */
    private removeExpenseFromView(expense: Expense): void {
        let elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    }

    /*
    * Set price information according to current budget and total expenses
    * */
    private setPriceInformation(): void {
        let totalExpensesPrice: number = 0;
        let filterdExpenses = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
        filterdExpenses.forEach((expense) => {
            totalExpensesPrice += Number(expense.price);
        });
        let budget = this.settingsService.getSettings().budget;
        this.htmlService.setPriceHoverReportTemplate(budget, totalExpensesPrice);
    }

    /*
    * filter expenses according to given month and year
    * */
    private filterExpenses(date: Date): Expense[]{
        let filterdExpenses: Expense[] = [];

        $.each(this.expenses, (idx, itm)=> {
            if(this.commonService.isTheSameMonthAndYear(itm.date, date)){
                filterdExpenses.push(itm);
            }
        });

        return filterdExpenses;
    }

    /*
    * Adding option for expense type to 'select' html element
    * */
    private addExpenseTypeOption(optionType: ExpenseType): void {
        let optionHtmlString = this.htmlService.getExpenseTypeOptionTemplate(optionType);
        $("#" + IdService.expensePageSelectId).append(optionHtmlString);
        $("#" + IdService.newExpensePageSelectId).append(optionHtmlString);
    }

    private showLoadMsg(): void {
        $.mobile.loading("show", {
            textVisible: true,
            theme: "z",
            html: `<div class="loading">
                                <span class="ui-bar ui-overlay-c ui-corner-all loader"><img src="assets/images/gears.gif"/>
                                    <h2>loading...</h2>
                                </span>
                           </div>`
        });
    }

    private hideLoadMsg(): void {
        $.mobile.loading("hide");
    }


    /*
    * Register to all system events
    * */
    private registerToEvents(): void {
        this.registerPageLoadEvent();
        this.registerDateFilterEvents();
        this.registerStatisticsPageEvents();
        this.registerToSettingsEvents();
        this.registerExpensesEvents();
    }

    /*
    * Register to events related to some expense (Add, Remove, Update..)
    * */
    private registerExpensesEvents(): void {
        $("#" + IdService.expensePageUpdateTheChangesId).click(() => {
            this.updateExpense(this.displayedExpense);
        });

        $("#" + IdService.expensePageDeleteExpenseId).click(() => {
            this.removeExpense(this.displayedExpense);
        });

        $("#" + IdService.addNewExpenseId).click(() => {
            this.expenseService.setDefaultExpenseToNewExpensePage();
        });

        let isFromNewExpensePage: boolean = true;
        $("#" + IdService.newExpensePageSaveTheChangesId).click(() => {
            let expense = this.expenseService.getExpenseFromView(isFromNewExpensePage);
            this.addExpense(expense);
        });
    }

    /*
    * Register to events related to change of settings
    * */
    private registerToSettingsEvents(): void {
        $("#" + IdService.settingsPageBtnId).click(() => {
            this.settingsService.setSettingsToView();
        });

        $("#" + IdService.settingsSaveTheChangesId).click(() => {
            this.showLoadMsg();
            this.settingsService.saveChanges(() => {
                this.setPriceInformation();
                this.htmlService.setGreetingMessage(this.settingsService.getSettings().name);
                this.hideLoadMsg();
            });
        });

        $("#" + IdService.settingsResetApp).click(() => {
            this.showLoadMsg();
            this.databaseService.deleteAllExpenses(() => {
                this.expenses = [];
                this.displayedExpense = new Expense();
                this.loadExpensesToView(this.expenses);
                this.setPriceInformation();
                this.hideLoadMsg();
            });
        });
    }

    /*
    * Register to date filter events (Arrow filters)
    * */
    private registerDateFilterEvents(): void {
        let isLeft = true;
        $("#" + IdService.dateFilterLeftArrowId).click(() => {
            this.handleArrowDateFilterClicked(isLeft);
        });

        $("#" + IdService.dateFilterRightArrowId).click(() => {
            this.handleArrowDateFilterClicked(!isLeft);
        });

        $("#" + IdService.dateFilterId).click(() => {
            this.handleExpenseDateFilterClicked();
        });
    }

    /*
    * Register to statistics page events
    * */
    private registerStatisticsPageEvents(): void {
        let selector = "#" + IdService.statisticsPageId;
        let tabSelected;
        let expensesToPieChart;

        // Create charts only if page is shown
        $(document).on("pageshow", selector, ()=> {
            if (tabSelected === IdService.pieChartTabId) {
                expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
                this.graphService.replotPieChartsEnhancedLegend(IdService.pieChartId, expensesToPieChart);
            }
            else {
                let currency = this.settingsService.getSettings().currency;
                this.graphService.replotBarLineAnimatedMonthly(IdService.barLineAnimatedId, this.expenses, currency);
            }
        });

        $("#" + IdService.barLineAnimatedTabId).click(() => {
            tabSelected = IdService.barLineAnimatedTabId;
            let currency = this.settingsService.getSettings().currency;
            this.graphService.replotBarLineAnimatedMonthly(IdService.barLineAnimatedId, this.expenses, currency);
        });

        $("#" + IdService.pieChartTabId).click(() => {
            tabSelected = IdService.pieChartTabId;
            expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
            this.graphService.replotPieChartsEnhancedLegend(IdService.pieChartId, expensesToPieChart);
        });
    }

    /*
    * Register events related to page loading and initializing
    * */
    private registerPageLoadEvent(): void {
        $(document).on("pagebeforecreate", "[data-role='page']", () => {
            var interval = setInterval(() => {
                this.showLoadMsg();
                clearInterval(interval);
            }, 1);
        });

        $(document).on("pageshow", "[data-role='page']", () => {
            var interval = setInterval(() => {
                this.hideLoadMsg();
                clearInterval(interval);
            }, 300);
        });
    }

    /* Handle events */

    private handleArrowDateFilterClicked(isLeft: boolean): void {
        this.clickAllExpensesToShow = false;
        let newMonth: number;
        let newYear: number = this.dateFilter.getFullYear();

        if(!isLeft){
            newMonth = this.dateFilter.getMonth() + 1
            if(newMonth === 12){
                newMonth = 0;
                newYear = this.dateFilter.getFullYear() + 1;
            }
        }
        else{
            newMonth = this.dateFilter.getMonth() - 1
            if(newMonth === 0){
                newMonth = 11;
                newYear = this.dateFilter.getFullYear() - 1;
            }
        }

        this.dateFilter.setMonth(newMonth);
        this.dateFilter.setFullYear(newYear);
        $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
    }

    private handleExpenseListChange(expenses?: Expense[]): void {
        this.htmlService.sortUL(IdService.expenseListId, SortType.Date);
        this.setPriceInformation();
        $("#" + IdService.expenseListId).listview("refresh");
    }

    private handleExpenseDateFilterClicked(): void {
        this.clickAllExpensesToShow = !this.clickAllExpensesToShow;
        if(this.clickAllExpensesToShow) {
            this.loadExpensesToView(this.expenses);
            $("#" + IdService.dateFilterId).text("All Expenses");
            this.clickAllExpensesToShow = true;
        }
        else {
            let filteredExpenses = this.filterExpenses(this.dateFilter);
            this.loadExpensesToView(filteredExpenses);
            $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
            this.clickAllExpensesToShow = false;
        }
    }

    private handleExpenseSelected(expense: Expense): void{
        this.displayedExpense = expense;
        this.expenseService.setSelectedExpense(expense);
    }
}