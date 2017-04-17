class ExpenseService {
    private readonly expensePageDatepickerId: string = 'expense-page-datepicker';
    private readonly expensePageSelectId: string = 'expense-page-select-type';
    private readonly expensePagePriceId: string = 'expense-page-price';
    private readonly expensePageCommentsId: string = 'expense-page-comments';

    private readonly newExpensePageDatepickerId: string = 'new-expense-page-datepicker';
    private readonly newExpensePageSelectId: string = 'new-expense-page-select-type';
    private readonly newExpensePagePriceId: string = 'new-expense-page-price';
    private readonly newExpensePageCommentsId: string = 'new-expense-page-comments';

    private datepickerService: DatepickerService = new DatepickerService();

    setSelectedExpense(expense: Expense): void {
        this.datepickerService.setDatepicker(this.expensePageDatepickerId, expense.date);
        $('#' + this.expensePagePriceId).val(expense.price);
        $('#' + this.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + this.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + this.expensePageSelectId).selectmenu('refresh');
        $('#' + this.expensePageCommentsId).val(expense.comments);
    }

    getUpdatedExpense(isFromNewPageExpense: boolean = false): Expense {
        let updatesExpanse: Expense = new Expense();
        let datepickerId = isFromNewPageExpense ? this.newExpensePageDatepickerId : this.expensePageDatepickerId;
        let priceId = isFromNewPageExpense ? this.newExpensePagePriceId : this.expensePagePriceId;
        let selectTypeId = isFromNewPageExpense ? this.newExpensePageSelectId : this.expensePageSelectId;
        let commentsId = isFromNewPageExpense ? this.newExpensePageCommentsId : this.expensePageCommentsId;

        updatesExpanse.date = this.datepickerService.getDatepicker(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();

        return updatesExpanse;
    }

    setDefaultExpenseToNewExpensePage(): void {
        this.datepickerService.setDatepicker(this.newExpensePageDatepickerId, new Date());
        $('#' + this.newExpensePagePriceId).val('');
        $('#' + this.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + this.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + this.newExpensePageSelectId).selectmenu('refresh');
        $('#' + this.newExpensePageCommentsId).val('');
    }
}