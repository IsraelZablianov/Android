var ExpenseService = (function () {
    function ExpenseService() {
        this.expensePageDatepickerId = 'expense-page-datepicker';
        this.expensePageSelectId = 'expense-page-select-type';
        this.expensePagePriceId = 'expense-page-price';
        this.expensePageCommentsId = 'expense-page-comments';
        this.newExpensePageDatepickerId = 'new-expense-page-datepicker';
        this.newExpensePageSelectId = 'new-expense-page-select-type';
        this.newExpensePagePriceId = 'new-expense-page-price';
        this.newExpensePageCommentsId = 'new-expense-page-comments';
        this.datepickerService = new DatepickerService();
    }
    ExpenseService.prototype.setSelectedExpense = function (expense) {
        this.datepickerService.setDatepicker(this.expensePageDatepickerId, expense.date);
        $('#' + this.expensePagePriceId).val(expense.price);
        $('#' + this.expensePageSelectId + " option:selected").prop("selected", false);
        $('#' + this.expensePageSelectId + ' option[value=' + expense.expenseType + ']').prop('selected', true);
        $('#' + this.expensePageSelectId).selectmenu('refresh');
        $('#' + this.expensePageCommentsId).val(expense.comments);
    };
    ExpenseService.prototype.getUpdatedExpense = function (isFromNewPageExpense) {
        if (isFromNewPageExpense === void 0) { isFromNewPageExpense = false; }
        var updatesExpanse = new Expense();
        var datepickerId = isFromNewPageExpense ? this.newExpensePageDatepickerId : this.expensePageDatepickerId;
        var priceId = isFromNewPageExpense ? this.newExpensePagePriceId : this.expensePagePriceId;
        var selectTypeId = isFromNewPageExpense ? this.newExpensePageSelectId : this.expensePageSelectId;
        var commentsId = isFromNewPageExpense ? this.newExpensePageCommentsId : this.expensePageCommentsId;
        updatesExpanse.date = this.datepickerService.getDatepicker(datepickerId);
        updatesExpanse.price = $('#' + priceId).val() || 0;
        updatesExpanse.expenseType = $('#' + selectTypeId + " option:selected").val();
        updatesExpanse.comments = $('#' + commentsId).val();
        return updatesExpanse;
    };
    ExpenseService.prototype.setDefaultExpenseToNewExpensePage = function () {
        this.datepickerService.setDatepicker(this.newExpensePageDatepickerId, new Date());
        $('#' + this.newExpensePagePriceId).val('');
        $('#' + this.newExpensePageSelectId + " option:selected").prop("selected", false);
        $('#' + this.newExpensePageSelectId + ' option[value=' + 0 + ']').prop('selected', true);
        $('#' + this.newExpensePageSelectId).selectmenu('refresh');
        $('#' + this.newExpensePageCommentsId).val('');
    };
    return ExpenseService;
}());
//# sourceMappingURL=expense-service.js.map