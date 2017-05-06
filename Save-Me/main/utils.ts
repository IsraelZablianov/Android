class Utils {
    private expenses: Expense[] = [];
    private displayedExpense: Expense;
    private dateFilter: Date = new Date();
    private clickAllExpensesToShow: boolean = false;

    private expenseListId: string = 'expense-list';
    private expensePageDatepickerId: string = 'expense-page-datepicker';
    private expensePageUpdateTheChangesId: string = 'expense-page-save-changes';
    private expensePageDeleteExpenseId: string = 'expense-page-delete-expense';
    private expensePageSelectId: string = 'expense-page-select-type';
    private newExpensePageSelectId: string = 'new-expense-page-select-type';
    private newExpensePageDatepickerId: string = 'new-expense-page-datepicker';
    private newExpensePageSaveTheChangesId: string = 'new-expense-page-save-changes';
    private addNewExpenseId: string = 'add-new-expense';
    private refreshHomePageId: string = 'refresh-home-page';
    private dateFilterId: string = 'date-filter-display';
    private dateFilterLeftArrowId: string = 'data-filter-left';
    private dateFilterRightArrowId: string = 'data-filter-right';
    private barLineAnimatedId: string = 'bar-line-animated';
    private pieChartId: string = 'pie-chart';
    private pieChartTabId: string = 'pie-chart-tab';
    private barLineAnimatedTabId: string = 'bar-line-animated-tab';
    private statisticsPageId: string = 'statistics-page';
    private statisticsTabsId: string = 'statistics-tabs';
    private settingsSaveTheChangesId: string = 'settings-save';
    private settingsPageBtnId: string = 'settings-page-id';

    private datepickerService: DatepickerService = new DatepickerService();
    private expenseService: ExpenseService = new ExpenseService();
    private htmlService: HtmlService = new HtmlService();
    private databaseService: DatabaseService = new DatabaseService();
    private graphService: GraphService = new GraphService();
    private commonService: CommonService = new CommonService();
    private settingsService: SettingsService = new SettingsService();

    constructor(){
        this.registerToEvents();
    }

    load() {
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
        let updatedExpense = this.expenseService.getUpdatedExpense();
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
        let expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense, this.settingsService.getSettings().currency);
        let expenseElementHtml = $(expenseStringHtml);
        expenseElementHtml.click(() => {
            this.handleExpenseSelected(expense)
        });

        if(this.clickAllExpensesToShow || this.commonService.isTheSameDate(expense.date, this.dateFilter)){
            $('#' + this.expenseListId).append(expenseElementHtml);
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
        $('#' + this.expensePageSelectId).append(optionHtmlString);
        $('#' + this.newExpensePageSelectId).append(optionHtmlString);
    }

    private registerToEvents() {
        this.registerPageLoadEvent();
        this.registerDateFilterEvents();
        this.registerStatisticsPageEvents();
        this.registerToSettingsEvents();
        this.registerExpensesEvents();

        $('#' + this.refreshHomePageId).click(() => {
            location.reload();
        });
    }

    private registerExpensesEvents() {
        $('#' + this.expensePageUpdateTheChangesId).click(() => {
            this.updateExpense(this.displayedExpense);
        });

        $('#' + this.expensePageDeleteExpenseId).click(() => {
            this.removeExpense(this.displayedExpense);
        });

        $('#' + this.addNewExpenseId).click(() => {
            this.expenseService.setDefaultExpenseToNewExpensePage();
        });

        let isFromNewExpensePage: boolean = true;
        $('#' + this.newExpensePageSaveTheChangesId).click(() => {
            let expense = this.expenseService.getUpdatedExpense(isFromNewExpensePage);
            this.addExpense(expense);
        });
    }

    private registerToSettingsEvents() {
        $('#' + this.settingsPageBtnId).click(() => {
            this.settingsService.setSettingsToView();
        });

        $('#' + this.settingsSaveTheChangesId).click(() => {
            this.showLoadMsg();
            this.settingsService.saveChanges(() => {
                this.setPriceInformation();
                this.hideLoadMsg();
            });
        });
    }

    private registerDateFilterEvents() {
        let isLeft = true;
        $('#' + this.dateFilterLeftArrowId).click(() => {
            this.handleArrowDateFilterClicked(isLeft);
        });

        $('#' + this.dateFilterRightArrowId).click(() => {
            this.handleArrowDateFilterClicked(!isLeft);
        });

        $('#' + this.dateFilterId).click(() => {
            this.handleExpenseDateClicked();
        });
    }

    private registerStatisticsPageEvents() {
        let selector = '#' + this.statisticsPageId;
        let tabSelected;
        let expensesToPieChart;

        $(document).on("pageshow", selector, ()=> {
            if (tabSelected === this.pieChartTabId) {
                expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
                this.graphService.replotPieChartsEnhancedLegend(this.pieChartId, expensesToPieChart);
            }
            else {
                let currency = this.settingsService.getSettings().currency;
                this.graphService.replotBarLineAnimatedMonthly(this.barLineAnimatedId, this.expenses, currency);
            }
        });

        $(window).on("orientationchange", (event) => {
            if (tabSelected === this.barLineAnimatedTabId) {
                let currency = this.settingsService.getSettings().currency;
                this.graphService.replotBarLineAnimatedMonthly(this.barLineAnimatedId, this.expenses, currency);
            }
            else if (tabSelected === this.pieChartTabId) {
                expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
                this.graphService.replotPieChartsEnhancedLegend(this.pieChartId, expensesToPieChart);
            }
        });

        $('#' + this.barLineAnimatedTabId).click(() => {
            tabSelected = this.barLineAnimatedTabId;
            let currency = this.settingsService.getSettings().currency;
            this.graphService.replotBarLineAnimatedMonthly(this.barLineAnimatedId, this.expenses, currency);
        });

        $('#' + this.pieChartTabId).click(() => {
            tabSelected = this.pieChartTabId;
            expensesToPieChart = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
            this.graphService.replotPieChartsEnhancedLegend(this.pieChartId, expensesToPieChart);
        });
    }

    private registerPageLoadEvent() {
        $(document).on('pagebeforecreate', '[data-role="page"]', () => {
            var interval = setInterval(() => {
                this.showLoadMsg();
                clearInterval(interval);
            }, 1);
        });

        $(document).on('pageshow', '[data-role="page"]', () => {
            var interval = setInterval(() => {
                $.mobile.loading('hide');
                clearInterval(interval);
            }, 300);
        });
    }

    private loadToView(): void {
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);

        let ebumValues = this.commonService.getEnumValues(ExpenseType);
        $.each(ebumValues, (index, expenseType)=>{
            this.addOptionTypeOfExpense(expenseType);
        });

        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    }

    private loadExpensesToView(expenses: Expense[]): void {
        $('#' + this.expenseListId + ' > li').remove();
        $.each(expenses, (index, expense)=> {
            this.addExpenseToView(expense);
        });

        this.handleExpenseListChange();
    }

    private loadComponents() {
        this.datepickerService.loadDatepicker(this.expensePageDatepickerId);
        $('#' + this.expensePageSelectId).selectmenu();
        this.datepickerService.loadDatepicker(this.newExpensePageDatepickerId);
        $('#' + this.newExpensePageSelectId).selectmenu();
        $('#' + this.addNewExpenseId).draggable();
        $( '#' + this.statisticsTabsId).tabs();
    }

    private loadSettings(calback) {
        this.showLoadMsg();
        this.settingsService.loadSettings(()=>{
            this.hideLoadMsg();
            calback();
        });
    }

    private showLoadMsg() {
        $.mobile.loading('show', {
            textVisible: true,
            theme: 'z',
            html: `<div class="loading">
                                <span class='ui-bar ui-overlay-c ui-corner-all loader'><img src='assets/images/gears.gif'/>
                                    <h2>loading...</h2>
                                </span>
                           </div>`
        });
    }

    private hideLoadMsg() {
        $.mobile.loading('hide');
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
        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);
    }

    private handleExpenseListChange(expenses?: Expense[]): void {
        this.htmlService.sortUL(this.expenseListId, SortType.Date);
        this.setPriceInformation();
        $('#' + this.expenseListId).listview("refresh");
    }

    private handleExpenseDateClicked(): void {
        this.clickAllExpensesToShow = !this.clickAllExpensesToShow;
        if(this.clickAllExpensesToShow) {
            this.loadExpensesToView(this.expenses);
            $('#' + this.dateFilterId).text('All Expenses');
            this.clickAllExpensesToShow = true;
        }
        else {
            let filteredExpenses = this.filterExpenses(this.dateFilter);
            this.loadExpensesToView(filteredExpenses);
            $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
            this.clickAllExpensesToShow = false;
        }
    }

    private handleExpenseSelected(expense: Expense): void{
        this.displayedExpense = expense;
        this.expenseService.setSelectedExpense(expense);
    }
}