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

    load() {
        this.registerToEvents();
        this.loadSettings(()=> {
            this.showLoadMsg();
            this.databaseService.getAllExpenses((expenses)=>{
                this.expenses = expenses;
                this.loadComponents();
                this.loadToView();
                this.hideLoadMsg();
            });
        });
    }

    addExpense(expense: Expense) {
        this.showLoadMsg();
        this.databaseService.addExpenseToDB(expense, (event)=>{
            this.expenses.push(expense);
            this.addExpenseToView(expense);
            this.handleExpenseListChange();
            this.hideLoadMsg();
        });
    }

    removeExpense(expense: Expense) {
        this.showLoadMsg();
        this.databaseService.removeExpenseFromDB(expense, ()=> {
            this.expenses.splice(this.expenses.indexOf(expense), 1);
            this.removeExpenseFromView(expense);
            this.handleExpenseListChange();
            this.hideLoadMsg();
        });
    }

    updateExpense(oldExpense: Expense) {
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

    private addExpenseToView(expense: Expense) {
        let expenseStringHtml = this.htmlService.getExpenseHtmlTemplate(expense, this.settingsService.getSettings().currency);
        let expenseElementHtml = $(expenseStringHtml);
        expenseElementHtml.click(() => {
            this.handleExpenseSelected(expense)
        });

        if(this.clickAllExpensesToShow || this.commonService.isTheSameDate(expense.date, this.dateFilter)){
            $("#" + IdService.expenseListId).append(expenseElementHtml);
        }
    }

    private removeExpenseFromView(expense: Expense) {
        let elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    }

    private setPriceInformation() {
        let totalExpensesPrice: number = 0;
        let filterdExpenses = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
        filterdExpenses.forEach((expense) => {
            totalExpensesPrice += Number(expense.price);
        });
        let budget = this.settingsService.getSettings().budget;
        this.htmlService.setPriceHoverReportTemplate(budget, totalExpensesPrice);
    }

    private filterExpenses(date: Date): Expense[]{
        let filterdExpenses: Expense[] = [];

        $.each(this.expenses, (idx, itm)=> {
            if(this.commonService.isTheSameDate(itm.date, date)){
                filterdExpenses.push(itm);
            }
        });

        return filterdExpenses;
    }

    private addOptionTypeOfExpense(optionType: ExpenseType): void{
        let optionHtmlString = this.htmlService.getOptionTypeExpenseTemplate(optionType);
        $("#" + IdService.expensePageSelectId).append(optionHtmlString);
        $("#" + IdService.newExpensePageSelectId).append(optionHtmlString);
    }

    private registerToEvents() {
        this.registerPageLoadEvent();
        this.registerDateFilterEvents();
        this.registerStatisticsPageEvents();
        this.registerToSettingsEvents();
        this.registerExpensesEvents();

        $("#" + IdService.refreshHomePageId).click(() => {
            location.reload();
        });
    }

    private registerExpensesEvents() {
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

    private registerToSettingsEvents() {
        $("#" + IdService.settingsPageBtnId).click(() => {
            this.settingsService.setSettingsToView();
        });

        $("#" + IdService.settingsSaveTheChangesId).click(() => {
            this.showLoadMsg();
            this.settingsService.saveChanges(() => {
                this.setPriceInformation();
                this.hideLoadMsg();
            });
        });
    }

    private registerDateFilterEvents() {
        let isLeft = true;
        $("#" + IdService.dateFilterLeftArrowId).click(() => {
            this.handleArrowDateFilterClicked(isLeft);
        });

        $("#" + IdService.dateFilterRightArrowId).click(() => {
            this.handleArrowDateFilterClicked(!isLeft);
        });

        $("#" + IdService.dateFilterId).click(() => {
            this.handleExpenseDateClicked();
        });
    }

    private registerStatisticsPageEvents() {
        let selector = "#" + IdService.statisticsPageId;
        let tabSelected;
        let expensesToPieChart;

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

        $(window).on("orientationchange", (event) => {
            if (tabSelected === IdService.barLineAnimatedTabId) {
                let currency = this.settingsService.getSettings().currency;
                this.graphService.replotBarLineAnimatedMonthly(IdService.barLineAnimatedId, this.expenses, currency);
            }
            else if (tabSelected === IdService.pieChartTabId) {
                expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
                this.graphService.replotPieChartsEnhancedLegend(IdService.pieChartId, expensesToPieChart);
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

    private registerPageLoadEvent() {
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

    private loadToView(): void {
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);

        let ebumValues = this.commonService.getEnumNumericKeys(ExpenseType);
        $.each(ebumValues, (index, expenseType)=>{
            this.addOptionTypeOfExpense(expenseType);
        });

        $("#" + IdService.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    }

    private loadExpensesToView(expenses: Expense[]): void {
        $("#" + IdService.expenseListId + " > li").remove();
        $.each(expenses, (index, expense)=> {
            this.addExpenseToView(expense);
        });

        this.handleExpenseListChange();
    }

    private loadComponents() {
        this.datepickerService.loadDatepicker(IdService.expensePageDatepickerId);
        this.datepickerService.loadDatepicker(IdService.newExpensePageDatepickerId);
        $("#" + IdService.expensePageSelectId).selectmenu();
        $("#" + IdService.newExpensePageSelectId).selectmenu();
        $('#' + IdService.settingsCurrencyId).selectmenu();
        $("#" + IdService.addNewExpenseId).draggable();
        $( "#" + IdService.statisticsTabsId).tabs();
    }

    private loadSettings(calback) {
        this.showLoadMsg();
        this.settingsService.loadSettings(()=>{
            this.hideLoadMsg();
            calback();
        });
    }

    private showLoadMsg() {
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

    private hideLoadMsg() {
        $.mobile.loading("hide");
    }

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

    private handleExpenseDateClicked(): void {
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