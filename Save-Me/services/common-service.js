var CommonService = (function () {
    function CommonService() {
    }
    CommonService.prototype.isTheSameDate = function (date1, date2) {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
    };
    CommonService.prototype.getEnumValues = function (enumType) {
        var _this = this;
        return Object
            .keys(enumType)
            .filter(function (key) { return _this.isIndex(key); })
            .map(function (index) { return Number(index); });
    };
    CommonService.prototype.isIndex = function (key) {
        var n = ~~Number(key);
        return String(n) === key && n >= 0;
    };
    return CommonService;
}());
//# sourceMappingURL=common-service.js.map