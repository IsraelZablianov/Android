class ExpenseService {
    private datepickerService: DatepickerService = new DatepickerService();

    setSelectedExpense(expense: Expense): void {
        this.datepickerService.setDatepicker(IdService.expensePageDatepickerId, expense.date);
        $('#' + IdService.expensePagePriceId).val(expense.price);
        $('#' + IdService.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + IdService.expensePageSelectId).selectmenu('refresh');
        $('#' + IdService.expensePageCommentsId).val(expense.comments);
    }

    getUpdatedExpense(isFromNewPageExpense: boolean = false): Expense {
        let updatesExpanse: Expense = new Expense();
        let datepickerId = isFromNewPageExpense ? IdService.newExpensePageDatepickerId : IdService.expensePageDatepickerId;
        let priceId = isFromNewPageExpense ? IdService.newExpensePagePriceId : IdService.expensePagePriceId;
        let selectTypeId = isFromNewPageExpense ? IdService.newExpensePageSelectId : IdService.expensePageSelectId;
        let commentsId = isFromNewPageExpense ? IdService.newExpensePageCommentsId : IdService.expensePageCommentsId;

        updatesExpanse.date = this.datepickerService.getDatepicker(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();

        return updatesExpanse;
    }

    setDefaultExpenseToNewExpensePage(): void {
        this.datepickerService.setDatepicker(IdService.newExpensePageDatepickerId, new Date());
        $('#' + IdService.newExpensePagePriceId).val('');
        $('#' + IdService.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + IdService.newExpensePageSelectId).selectmenu('refresh');
        $('#' + IdService.newExpensePageCommentsId).val('');
    }
}