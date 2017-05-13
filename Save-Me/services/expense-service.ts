/*
* This class service is handling the expenses list and expenses pages.
* */
class ExpenseService {
    private datepickerService: DatepickerService = new DatepickerService();

    /*
    * Setting the selected expense from the list to the expense page for deleting or updating purpose.
    * */
    setSelectedExpense(expense: Expense): void {
        this.datepickerService.setDatepickerDate(IdService.expensePageDatepickerId, expense.date);
        $('#' + IdService.expensePagePriceId).val(expense.price);
        $('#' + IdService.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + IdService.expensePageSelectId).selectmenu('refresh');
        $('#' + IdService.expensePageCommentsId).val(expense.comments);
    }

    /*
    * Getting the expense that is currently display on expense page or on new expense page.
    * */
    getExpenseFromView(isFromNewPageExpense: boolean = false): Expense {
        let updatesExpanse: Expense = new Expense();
        let datepickerId = isFromNewPageExpense ? IdService.newExpensePageDatepickerId : IdService.expensePageDatepickerId;
        let priceId = isFromNewPageExpense ? IdService.newExpensePagePriceId : IdService.expensePagePriceId;
        let selectTypeId = isFromNewPageExpense ? IdService.newExpensePageSelectId : IdService.expensePageSelectId;
        let commentsId = isFromNewPageExpense ? IdService.newExpensePageCommentsId : IdService.expensePageCommentsId;

        updatesExpanse.date = this.datepickerService.getDatepickerDate(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();

        return updatesExpanse;
    }

    /*
    * Setting a default expense to new expense page (this method is called after the new expense button is pressed).
    * */
    setDefaultExpenseToNewExpensePage(): void {
        this.datepickerService.setDatepickerDate(IdService.newExpensePageDatepickerId, new Date());
        $('#' + IdService.newExpensePagePriceId).val('');
        $('#' + IdService.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + IdService.newExpensePageSelectId).selectmenu('refresh');
        $('#' + IdService.newExpensePageCommentsId).val('');
    }
}