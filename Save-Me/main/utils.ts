class Utils {
    expenses: Expense[] = [];
    displayedExpense: Expense;
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
            this.addExpenseToView(expense);
            this.handleExpenseListChange(expense);
        });
    }

    removeExpense(expense: Expense) {
        this.databaseService.removeExpenseFromDB(expense, ()=> {
            this.expenses.splice(this.expenses.indexOf(expense), 1);
            this.removeExpenseFromView(expense);
            this.handleExpenseListChange(expense);
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
            this.handleExpenseListChange(oldExpense);
        });
    }

    private addExpenseToView(expense: Expense) {
        this.expenses.push(expense);
        let expenseStringHtml = this.htmlService.getExpenseHtmlTemlate(expense);
        let expenseHtmlElement = $(expenseStringHtml);
        expenseHtmlElement.on('click', () => {
            this.handleExpenseSelected(expense)
        });

        $('#' + this.expenseListId).append(expenseHtmlElement);
        this.htmlService.sortUL(this.expenseListId, SortType.Date);
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
    }

    private loadToView(): void {
        $.each(this.expenses, (index, expense)=>{
            this.addExpenseToView(expense);
        });

        this.handleExpenseListChange();

        let ebumValues = Object
            .keys(ExpenseType)
            .filter(key => this.isIndex(key))
            .map(index => Number(index));
        $.each(ebumValues, (index, expenseType)=>{
            this.addOptionTypeOfExpense(expenseType);
        });
    }




    private handleExpenseListChange(expense?: Expense): void{
        let selector = '#' + this.expenseListId;
        $(selector).listview("refresh");
    }

    private handleExpenseSelected(expense: Expense): void{
        this.displayedExpense = expense;
        this.expenseService.setSelectedExpense(expense);
    }

    private  isIndex(key):boolean {
        let n = ~~Number(key);
        return String(n) === key && n >= 0;
    }

    private addOptionTypeOfExpense(optionType: ExpenseType): void{
        let optionHtmlString = this.htmlService.getOptionTypeExpenseTemplate(optionType);
        $('#' + this.expensePageSelectId).append(optionHtmlString);
        $('#' + this.newExpensePageSelectId).append(optionHtmlString);
    }
}