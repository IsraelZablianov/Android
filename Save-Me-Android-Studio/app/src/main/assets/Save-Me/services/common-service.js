/*
* This class service is a general service that store methods with different use for all
* Of the system.
* */
var CommonService = (function () {
    function CommonService() {
        this.shortMonthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"];
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
    CommonService.prototype.isTheSameMonthAndYear = function (date1, date2) {
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
    * Returns greeting message according to current time.
    * */
    CommonService.prototype.getGreetingMessage = function () {
        var today = new Date();
        var curHr = today.getHours();
        if (curHr < 12) {
            return "Good Morning";
        }
        else if (curHr < 18) {
            return "Good Afternoon";
        }
        else {
            return "Good evening";
        }
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
    CommonService.prototype.getshortMonthNames = function () {
        return this.shortMonthNames;
    };
    CommonService.prototype.isIndex = function (key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    };
    return CommonService;
}());
//# sourceMappingURL=common-service.js.map