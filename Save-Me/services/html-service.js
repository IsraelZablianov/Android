var HtmlService = (function () {
    function HtmlService() {
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"];
        this.expenseTypeNames = [
            "Food & Drinks",
            "House",
            "Entertainment",
            "Clothes",
            "Car",
            "Bills",
            "Other"
        ];
        this.weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.iconsPath = "assets/icons/";
        this.icons = [
            "food.png",
            "house.jpg",
            "entertainment.png",
            "clothes.png",
            "car.png",
            "bills.png",
            "other.png"];
    }
    HtmlService.prototype.sortUL = function (id, sortType) {
        var sortFunction;
        sortFunction = sortType === SortType.Date ? this.dateSort : this.priceSort;
        var ul = $('#' + id);
        var listItems = ul.children('li').get();
        listItems.sort(sortFunction);
        $.each(listItems, function (idx, itm) { ul.append(itm); });
    };
    HtmlService.prototype.getExpenseHtmlTemlate = function (expense) {
        return "\n            <li id=\"" + expense.id + "\" date=\"" + expense.date + "\" price=\"" + expense.price + "\">\n                <a href=\"#expense-page\" class=\"expense-wrapper\">\n                    <div class=\"expense-display\">\n                        <div class=\"date-section\">\n                            <div class=\"date-display\">\n                                <div>" + this.getDate(expense.date) + "</div>\n                            </div>\n                            <div class=\"day-display\">\n                                <div>" + this.getDay(expense.date) + "</div>\n                            </div>\n                            <div class=\"month-display\">\n                                <div>" + this.getMonth(expense.date) + "</div>\n                            </div>\n                            <div class=\"year-display\">\n                                <div>" + this.getYear(expense.date) + "</div>\n                            </div>\n                        </div>\n                        <div class=\"content-section\">\n                            <img class=\"icon-display\" src=" + (this.iconsPath + this.icons[expense.expenseType]) + ">\n                            <h1 class=\"type-display\">" + this.expenseTypeNames[expense.expenseType] + "</h1>\n                            <p class=\"comments-display\">" + expense.comments + "</p>\n                            <span class=\"price-display\">" + expense.price + " ILS</span>\n                        </div>\n                    </div>\n                </a>\n            </li>";
    };
    HtmlService.prototype.getOptionTypeExpenseTemplate = function (optionType) {
        return "<option value=\"" + optionType + "\">" + this.expenseTypeNames[optionType] + "</option>";
    };
    HtmlService.prototype.activateDragAndDrop = function (elementId) {
        $('#' + elementId).draggable();
    };
    HtmlService.prototype.getYearAndMonthDisplay = function (date) {
        return date.getFullYear() + ' ' + this.monthNames[date.getMonth()];
    };
    HtmlService.prototype.getDate = function (date) {
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day;
    };
    HtmlService.prototype.getMonth = function (date) {
        return this.monthNames[date.getMonth()];
    };
    HtmlService.prototype.getYear = function (date) {
        return date.getFullYear().toString();
    };
    HtmlService.prototype.getDay = function (date) {
        return this.weekday[date.getDay()];
    };
    HtmlService.prototype.dateSort = function (a, b) {
        var aDate = new Date(a.getAttribute('date'));
        var bDate = new Date(b.getAttribute('date'));
        return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    };
    HtmlService.prototype.priceSort = function (a, b) {
        var aPrice = a.getAttribute('price');
        var bPrice = b.getAttribute('price');
        return aPrice > bPrice ? 1 : aPrice < bPrice ? -1 : 0;
    };
    return HtmlService;
}());
//# sourceMappingURL=html-service.js.map