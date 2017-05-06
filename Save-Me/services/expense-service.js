var ExpenseService = (function () {
    function ExpenseService() {
        this.datepickerService = new DatepickerService();
    }
    ExpenseService.prototype.setSelectedExpense = function (expense) {
        this.datepickerService.setDatepicker(IdService.expensePageDatepickerId, expense.date);
        $('#' + IdService.expensePagePriceId).val(expense.price);
        $('#' + IdService.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + IdService.expensePageSelectId).selectmenu('refresh');
        $('#' + IdService.expensePageCommentsId).val(expense.comments);
    };
    ExpenseService.prototype.getUpdatedExpense = function (isFromNewPageExpense) {
        if (isFromNewPageExpense === void 0) { isFromNewPageExpense = false; }
        var updatesExpanse = new Expense();
        var datepickerId = isFromNewPageExpense ? IdService.newExpensePageDatepickerId : IdService.expensePageDatepickerId;
        var priceId = isFromNewPageExpense ? IdService.newExpensePagePriceId : IdService.expensePagePriceId;
        var selectTypeId = isFromNewPageExpense ? IdService.newExpensePageSelectId : IdService.expensePageSelectId;
        var commentsId = isFromNewPageExpense ? IdService.newExpensePageCommentsId : IdService.expensePageCommentsId;
        updatesExpanse.date = this.datepickerService.getDatepicker(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();
        return updatesExpanse;
    };
    ExpenseService.prototype.setDefaultExpenseToNewExpensePage = function () {
        this.datepickerService.setDatepicker(IdService.newExpensePageDatepickerId, new Date());
        $('#' + IdService.newExpensePagePriceId).val('');
        $('#' + IdService.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + IdService.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + IdService.newExpensePageSelectId).selectmenu('refresh');
        $('#' + IdService.newExpensePageCommentsId).val('');
    };
    return ExpenseService;
}());
//# sourceMappingURL=expense-service.js.map