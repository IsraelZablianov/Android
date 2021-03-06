/*
* Types of expenses
* */
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
/*
* Types of available charts
* */
var ChartType;
(function (ChartType) {
    ChartType[ChartType["Months"] = 0] = "Months";
    ChartType[ChartType["ExpenseType"] = 1] = "ExpenseType";
})(ChartType || (ChartType = {}));
/*
* Types of sort for the list of expenses in home page.
* */
var SortType;
(function (SortType) {
    SortType[SortType["Date"] = 0] = "Date";
    SortType[SortType["Price"] = 1] = "Price";
})(SortType || (SortType = {}));
/*
* Settings .
* */
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
/*
 * Expense type description
 * */
var Expense = (function () {
    function Expense() {
    }
    return Expense;
}());
//# sourceMappingURL=models.js.map