var Expense = (function () {
    function Expense() {
    }
    return Expense;
}());
var ExpenseType;
(function (ExpenseType) {
    ExpenseType[ExpenseType["Food"] = 0] = "Food";
    ExpenseType[ExpenseType["House"] = 1] = "House";
    ExpenseType[ExpenseType["Entertainment"] = 2] = "Entertainment";
    ExpenseType[ExpenseType["Clothes"] = 3] = "Clothes";
    ExpenseType[ExpenseType["Car"] = 4] = "Car";
    ExpenseType[ExpenseType["Bills"] = 5] = "Bills";
    ExpenseType[ExpenseType["Other"] = 6] = "Other";
})(ExpenseType || (ExpenseType = {}));
var SortType;
(function (SortType) {
    SortType[SortType["Date"] = 0] = "Date";
    SortType[SortType["Price"] = 1] = "Price";
})(SortType || (SortType = {}));
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
//# sourceMappingURL=models.js.map