var DatabaseService = (function () {
    function DatabaseService() {
        this.expenseStoreName = 'expenses';
        this.databaseVersion = 2;
        this.readWriteMode = "readwrite";
        this.readonlyMode = "readonly";
        this.expensesStore = localforage.createInstance({
            driver: localforage.INDEXEDDB,
            name: this.expenseStoreName + 'DB',
            version: 1.0,
            storeName: this.expenseStoreName,
            description: 'stores all expenses'
        });
    }
    DatabaseService.prototype.addExpenseToDB = function (expense, calback) {
        expense.id = this.createId();
        this.expensesStore.setItem(expense.id, expense, calback);
    };
    DatabaseService.prototype.removeExpenseFromDB = function (expense, calback) {
        this.expensesStore.removeItem(expense.id, calback);
    };
    DatabaseService.prototype.updateExpenseToDB = function (expense, calback) {
        var _this = this;
        this.expensesStore.removeItem(expense.id, function () {
            _this.expensesStore.setItem(expense.id, expense, calback);
        });
    };
    DatabaseService.prototype.getAllExpenses = function (callback) {
        var _this = this;
        this.expensesStore.keys().then(function (items) {
            var promises = items.map(function (item) { return _this.expensesStore.getItem(item); });
            Promise.all(promises).then(function (results) {
                callback(results);
            });
        });
    };
    DatabaseService.prototype.clearAll = function (calback) {
        this.expensesStore.clear(calback);
    };
    DatabaseService.prototype.createId = function () {
        return new Date().getTime() + (Math.random() * 100).toString();
    };
    return DatabaseService;
}());
//# sourceMappingURL=database-service.js.map