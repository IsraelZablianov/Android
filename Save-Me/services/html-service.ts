/*
* This service is responsible for manipulating html components, create new templates
* And all Html related issues.
* */

class HtmlService {
    private iconsPath: string = "assets/icons/";
    private icons:string[] = [
        "food.png",
        "house.jpg",
        "entertainment.png",
        "clothes.png",
        "car.png",
        "bills.png",
        "other.png"];
    private expensesPriceClass: string = "expense-price-color";
    private budgetPriceClass: string = "budget-price-color";
    private commonService: CommonService = new CommonService();

    /*
    * Sort the list of expenses.
    * */
    sortUL(id: string, sortType: SortType): void {
        let sortFunction;
        sortFunction = sortType === SortType.Date ? this.dateSort : this.priceSort;
        var ul = $('#' + id);
        var listItems = ul.children('li').get();
        listItems.sort(sortFunction);
        $.each(listItems, (idx, itm)=> { ul.append(itm); });
    }

    /*
    * Templates generating methods.
    * */
    getExpenseHtmlTemplate(expense: Expense, currency?: string): string {
        currency = currency ? currency : 'ILS';
        return `
            <li id="${expense.id}" date="${expense.date}" price="${expense.price}">
                <a href="#expense-page" class="expense-wrapper">
                    <div class="expense-display">
                        <div class="date-section">
                            <div class="date-display">
                                <div>${this.getDate(expense.date)}</div>
                            </div>
                            <div class="day-display">
                                <div>${this.getDay(expense.date)}</div>
                            </div>
                            <div class="month-display">
                                <div>${this.getMonth(expense.date)}</div>
                            </div>
                            <div class="year-display">
                                <div>${this.getYear(expense.date)}</div>
                            </div>
                        </div>
                        <div class="content-section">
                            <img class="icon-display" src=${this.iconsPath + this.icons[expense.expenseType]}>
                            <h1 class="type-display">${this.commonService.getExpenseTypeNames()[expense.expenseType]}</h1>
                            <p class="comments-display">${expense.comments}</p>
                            <span class="price-display">${expense.price} ${currency}</span>
                        </div>
                    </div>
                </a>
            </li>`;
    }

    getExpenseTypeOptionTemplate(optionType: ExpenseType): string{
        return `<option value="${optionType}">${this.commonService.getExpenseTypeNames()[optionType]}</option>`;
    }

    getYearAndMonthDisplay(date: Date): string{
        return date.getFullYear() + ' ' + this.commonService.getMonthNames()[date.getMonth()];
    }

    setPriceHoverReportTemplate(budgetPrice: number, expensesPrice: number): void {
        $('#' + IdService.hoverPriceExpensePriceId).text(Number(expensesPrice).toFixed(2));
        $('#' + IdService.hoverPriceBudgetPriceId).text(Number(budgetPrice).toFixed(2));
        let reportPrice = budgetPrice - expensesPrice;
        if(reportPrice < 0) {
            this.manageHoverPriceClasses(this.expensesPriceClass, this.budgetPriceClass);
        }
        else {
            this.manageHoverPriceClasses(this.budgetPriceClass, this.expensesPriceClass);
        }

        $('#' + IdService.hoverPriceReportTotalPriceId).text(Number(reportPrice).toFixed(2));
    }

    /*
    * Set color Red for Alert (expenses are over the budget) or blue.
    * */
    private manageHoverPriceClasses(classToAdd: string, classToRemove: string): void {
        let reortTotalPriceElement = $('#' + IdService.hoverPriceReportTotalPriceId);
        if(reortTotalPriceElement.hasClass(classToRemove)) {
            reortTotalPriceElement.removeClass(classToRemove)
        }
        if(!reortTotalPriceElement.hasClass(classToAdd)) {
            reortTotalPriceElement.addClass(classToAdd)
        }
    }

    /*
    * Get dates format.
    * */
    private getDate(date : Date): string {
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day;
    }

    private getMonth(date : Date): string {
        return this.commonService.getMonthNames()[date.getMonth()];
    }

    private getYear(date : Date): string {
        return date.getFullYear().toString();
    }

    private getDay(date : Date): string {
        return this.commonService.getDayNames()[date.getDay()];
    }

    /*
    * sorting methods
    * */
    private dateSort(a, b): number {
        let aDate = new Date(a.getAttribute('date'));
        let bDate = new Date(b.getAttribute('date'));

        return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    }

    private priceSort(a, b): number {
        let aPrice = a.getAttribute('price');
        let bPrice = b.getAttribute('price');

        return aPrice > bPrice ? 1 : aPrice < bPrice ? -1 : 0;
    }
}














