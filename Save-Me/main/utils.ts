class Utils {
    expenses: Expense[] = [];
    displayedExpense: Expense;
    dateFilter: Date = new Date();
    clickAllExpensesToShow: boolean = false;

    budget: number = 3000;

    expenseListId: string = 'expense-list';
    expensePageDatepickerId: string = 'expense-page-datepicker';
    expensePageSaveChangesId: string = 'expense-page-save-changes';
    expensePageDeleteExpenseId: string = 'expense-page-delete-expense';
    expensePageSelectId: string = 'expense-page-select-type';
    newExpensePageSelectId: string = 'new-expense-page-select-type';
    newExpensePageDatepickerId: string = 'new-expense-page-datepicker';
    newExpensePageSaveChangesId: string = 'new-expense-page-save-changes';
    addNewExpenseId: string = 'add-new-expense';
    refreshHomePageId: string = 'refresh-home-page';
    dateFilterId: string = 'date-filter-display';
    dateFilterLeftArrowId: string = 'data-filter-left';
    dateFilterRightArrowId: string = 'data-filter-right';
    private containerPriceId: string = 'hover-price-report-container';

    datepickerService: DatepickerService = new DatepickerService();
    expenseService: ExpenseService = new ExpenseService();
    htmlService: HtmlService = new HtmlService();
    databaseService: DatabaseService = new DatabaseService();

    constructor(){
        this.registerToEvents();
    }

    load() {
        this.databaseService.getAllExpenses((expenses)=>{
            this.expenses = expenses;
            this.loadJqueryComponents();
            this.loadToView();
        });
    }

    addExpense(expense: Expense) {
        this.databaseService.addExpenseToDB(expense, (event)=>{
            this.expenses.push(expense);
            this.addExpenseToView(expense);
            this.handleExpenseListChange();
        });
    }

    removeExpense(expense: Expense) {
        this.databaseService.removeExpenseFromDB(expense, ()=> {
            this.expenses.splice(this.expenses.indexOf(expense), 1);
            this.removeExpenseFromView(expense);
            this.handleExpenseListChange();
        });
    }

    updateExpense(oldExpense: Expense) {
        let updatedExpense = this.expenseService.getUpdatedExpense();
        updatedExpense.id = this.displayedExpense.id;

        this.databaseService.updateExpenseToDB(updatedExpense, ()=>{
            this.expenses.splice(this.expenses.indexOf(oldExpense), 1);
            this.expenses.push(updatedExpense);
            this.removeExpenseFromView(this.displayedExpense);
            this.addExpenseToView(updatedExpense);
            this.handleExpenseListChange();
        });
    }



    private addExpenseToView(expense: Expense) {
        let expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense);
        let expenseHtmlElement = $(expenseStringHtml);
        expenseHtmlElement.on('click', () => {
            this.handleExpenseSelected(expense)
        });

        if(this.clickAllExpensesToShow || this.isTheSameDate(expense.date, this.dateFilter)){
            $('#' + this.expenseListId).append(expenseHtmlElement);
        }
    }

    private removeExpenseFromView(expense: Expense) {
        let elem = document.getElementById(expense.id);
        elem.parentNode.removeChild(elem);
    }

    private loadJqueryComponents() {
        this.datepickerService.loadDatepicker(this.expensePageDatepickerId);
        $('#' + this.expensePageSelectId).selectmenu();
        this.datepickerService.loadDatepicker(this.newExpensePageDatepickerId);
        $('#' + this.newExpensePageSelectId).selectmenu();
        this.htmlService.activateDragAndDrop(this.addNewExpenseId);
    }

    private loadExpensesToView(expenses: Expense[]): void {
        $('#' + this.expenseListId + ' > li').remove();
        $.each(expenses, (index, expense)=> {
            this.addExpenseToView(expense);
        });

        this.handleExpenseListChange();
    }

    private loadToView(): void {
        let filteredExpenses = this.filterExpenses(this.dateFilter);
        this.loadExpensesToView(filteredExpenses);

        let ebumValues = Object
            .keys(ExpenseType)
            .filter(key => this.isIndex(key))
            .map(index => Number(index));
        $.each(ebumValues, (index, expenseType)=>{
            this.addOptionTypeOfExpense(expenseType);
        });

        $('#' + this.dateFilterId).text(this.htmlService.getYearAndMonthDisplay(this.dateFilter));
    }




    private registerToEvents() {
        $(document).on('pagebeforecreate', '[data-role="page"]', ()=> {
            var interval = setInterval(()=> {
                $.mobile.loading('show', {
                    text: 'foo',
                    textVisible: true,
                    theme: 'z',
                    html: "<span class='ui-bar ui-overlay-c ui-corner-all loader'><img src='assets/images/gears.gif' /><h2>loading...</h2></span>"
                });
                clearInterval(interval);
            },1);
        });

        $(document).on('pageshow', '[data-role="page"]', ()=> {
            var interval = setInterval(()=> {
                $.mobile.loading('hide');
                clearInterval(interval);
            },300);
        });

        $('#' + this.refreshHomePageId).click(() => {
            location.reload();
        });

        $('#' + this.expensePageSaveChangesId).click(() => {
            this.updateExpense(this.displayedExpense);
        });

        $('#' + this.expensePageDeleteExpenseId).click(() => {
            this.removeExpense(this.displayedExpense);
        });

        $('#' + this.addNewExpenseId).click(() => {
            this.expenseService.setDefaultExpenseToNewExpensePage();
        });

        $('#' + this.newExpensePageSaveChangesId).click(() => {
            let isFromNewExpensePage: boolean = true;
            let expense = this.expenseService.getUpdatedExpense(isFromNewExpensePage);
            this.addExpense(expense);
        });

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

    private filterExpenses(date: Date): Expense[]{
        let filterdExpenses: Expense[] = [];

        $.each(this.expenses, (idx, itm)=> {
            if(this.isTheSameDate(itm.date, date)){
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
        let selector = '#' + this.expenseListId;
        this.setPriceInformation();
        $(selector).listview("refresh");
    }

    private setPriceInformation() {
        let expensesPrice: number = 0;
        let filterdExpenses = this.clickAllExpensesToShow ? this.expenses : this.filterExpenses(this.dateFilter);
        filterdExpenses.forEach((expense) => {
            expensesPrice += Number(expense.price);
        });
        this.htmlService.setPriceHoverReportTemplate(this.budget, expensesPrice);
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




    private isTheSameDate(date1: Date, date2: Date): boolean {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }

    private  isIndex(key):boolean {
        let n = ~~Number(key);
        return String(n) === key && n >= 0;
    }
}