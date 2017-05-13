/*
* This class service is handling the expenses list and expenses pages.
* */
var ExpenseService = (function () {
    function ExpenseService() {
        this.datepickerService = new DatepickerService();
    }
    /*
    * Setting the selected expense from the list to the expense page for deleting or updating purpose.
    * */
    ExpenseService.prototype.setSelectedExpense = function (expense) {
        this.datepickerService.setDatepickerDate(IdService.expensePageDatepickerId, expense.date);
        $('#' + IdService.expensePagePriceId).val(expense.price);
        $('#' + IdService.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + IdService.expensePageSelectId).selectmenu('refresh');
        $('#' + IdService.expensePageCommentsId).val(expense.comments);
    };
    /*
    * Getting the expense that is currently display on expense page or on new expense page.
    * */
    ExpenseService.prototype.getExpenseFromView = function (isFromNewPageExpense) {
        if (isFromNewPageExpense === void 0) { isFromNewPageExpense = false; }
        var updatesExpanse = new Expense();
        var datepickerId = isFromNewPageExpense ? IdService.newExpensePageDatepickerId : IdService.expensePageDatepickerId;
        var priceId = isFromNewPageExpense ? IdService.newExpensePagePriceId : IdService.expensePagePriceId;
        var selectTypeId = isFromNewPageExpense ? IdService.newExpensePageSelectId : IdService.expensePageSelectId;
        var commentsId = isFromNewPageExpense ? IdService.newExpensePageCommentsId : IdService.expensePageCommentsId;
        updatesExpanse.date = this.datepickerService.getDatepickerDate(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();
        return updatesExpanse;
    };
    /*
    * Setting a default expense to new expense page (this method is called after the new expense button is pressed).
    * */
    ExpenseService.prototype.setDefaultExpenseToNewExpensePage = function () {
        this.datepickerService.setDatepickerDate(IdService.newExpensePageDatepickerId, new Date());
        $('#' + IdService.newExpensePagePriceId).val('');
        $('#' + IdService.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + IdService.newExpensePageSelectId).selectmenu('refresh');
        $('#' + IdService.newExpensePageCommentsId).val('');
    };
    return ExpenseService;
}());
//# sourceMappingURL=expense-service.js.map