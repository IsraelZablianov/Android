/*
* This class service is a general service that store methods with different use for all
* Of the system.
* */
var CommonService = (function () {
    function CommonService() {
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"];
        this.expenseTypeNames = [
            "Food",
            "House",
            "Entertainment",
            "Clothes",
            "Car",
            "Bills",
            "Other"
        ];
        this.weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }
    CommonService.prototype.isTheSameDate = function (date1, date2) {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    };
    CommonService.prototype.getEnumNumericKeys = function (enumType) {
        var _this = this;
        return Object
            .keys(enumType)
            .filter(function (key) { return _this.isIndex(key); })
            .map(function (index) { return Number(index); });
    };
    /*
    * Those methods 'get..names' are here so in the future it will be easier to add multi languages support.
    * */
    CommonService.prototype.getMonthNames = function () {
        return this.monthNames;
    };
    CommonService.prototype.getDayNames = function () {
        return this.weekdayNames;
    };
    CommonService.prototype.getExpenseTypeNames = function () {
        return this.expenseTypeNames;
    };
    CommonService.prototype.isIndex = function (key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    };
    return CommonService;
}());
//# sourceMappingURL=common-service.js.map