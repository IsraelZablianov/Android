/*
* This service is responsible for manipulating html components, create new templates
* And all Html related issues.
* */
var HtmlService = (function () {
    function HtmlService() {
        this.iconsPath = "assets/icons/";
        this.icons = [
            "food.png",
            "house.jpg",
            "entertainment.png",
            "clothes.png",
            "car.png",
            "bills.png",
            "other.png"];
        this.expensesPriceClass = "expense-price-color";
        this.budgetPriceClass = "budget-price-color";
        this.commonService = new CommonService();
    }
    /*
    * Sort the list of expenses.
    * */
    HtmlService.prototype.sortUL = function (id, sortType) {
        var sortFunction;
        sortFunction = sortType === SortType.Date ? this.dateSort : this.priceSort;
        var ul = $('#' + id);
        var listItems = ul.children('li').get();
        listItems.sort(sortFunction);
        $.each(listItems, function (idx, itm) { ul.append(itm); });
    };
    /*
    * Templates generating methods.
    * */
    HtmlService.prototype.getExpenseHtmlTemplate = function (expense, currency) {
        currency = currency ? currency : 'ILS';
        return "\n            <li id=\"" + expense.id + "\" date=\"" + expense.date + "\" price=\"" + expense.price + "\">\n                <a href=\"#expense-page\" class=\"expense-wrapper\">\n                    <div class=\"expense-display\">\n                        <div class=\"date-section\">\n                            <div class=\"date-display\">\n                                <div>" + this.getDate(expense.date) + "</div>\n                            </div>\n                            <div class=\"day-display\">\n                                <div>" + this.getDay(expense.date) + "</div>\n                            </div>\n                            <div class=\"month-display\">\n                                <div>" + this.getMonth(expense.date) + "</div>\n                            </div>\n                            <div class=\"year-display\">\n                                <div>" + this.getYear(expense.date) + "</div>\n                            </div>\n                        </div>\n                        <div class=\"content-section\">\n                            <img class=\"icon-display\" src=" + (this.iconsPath + this.icons[expense.expenseType]) + ">\n                            <h1 class=\"type-display\">" + this.commonService.getExpenseTypeNames()[expense.expenseType] + "</h1>\n                            <p class=\"comments-display\">" + expense.comments + "</p>\n                            <span class=\"price-display\">" + expense.price + " " + currency + "</span>\n                        </div>\n                    </div>\n                </a>\n            </li>";
    };
    HtmlService.prototype.getOptionTypeExpenseTemplate = function (optionType) {
        return "<option value=\"" + optionType + "\">" + this.commonService.getExpenseTypeNames()[optionType] + "</option>";
    };
    HtmlService.prototype.getYearAndMonthDisplay = function (date) {
        return date.getFullYear() + ' ' + this.commonService.getMonthNames()[date.getMonth()];
    };
    HtmlService.prototype.setPriceHoverReportTemplate = function (budgetPrice, expensesPrice) {
        $('#' + IdService.hoverPriceExpensePriceId).text(Number(expensesPrice).toFixed(2));
        $('#' + IdService.hoverPriceBudgetPriceId).text(Number(budgetPrice).toFixed(2));
        var reportPrice = budgetPrice - expensesPrice;
        if (reportPrice < 0) {
            this.manageHoverPriceClasses(this.expensesPriceClass, this.budgetPriceClass);
        }
        else {
            this.manageHoverPriceClasses(this.budgetPriceClass, this.expensesPriceClass);
        }
        $('#' + IdService.hoverPriceReportTotalPriceId).text(Number(reportPrice).toFixed(2));
    };
    /*
    * Set color Red for Alert (expenses are over the budget) or blue.
    * */
    HtmlService.prototype.manageHoverPriceClasses = function (classToAdd, classToRemove) {
        var reortTotalPriceElement = $('#' + IdService.hoverPriceReportTotalPriceId);
        if (reortTotalPriceElement.hasClass(classToRemove)) {
            reortTotalPriceElement.removeClass(classToRemove);
        }
        if (!reortTotalPriceElement.hasClass(classToAdd)) {
            reortTotalPriceElement.addClass(classToAdd);
        }
    };
    /*
    * Get dates format.
    * */
    HtmlService.prototype.getDate = function (date) {
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day;
    };
    HtmlService.prototype.getMonth = function (date) {
        return this.commonService.getMonthNames()[date.getMonth()];
    };
    HtmlService.prototype.getYear = function (date) {
        return date.getFullYear().toString();
    };
    HtmlService.prototype.getDay = function (date) {
        return this.commonService.getDayNames()[date.getDay()];
    };
    /*
    * sorting methods
    * */
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