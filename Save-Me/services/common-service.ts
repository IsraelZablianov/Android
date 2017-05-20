/*
* This class service is a general service that store methods with different use for all
* Of the system.
* */

class CommonService {
    private shortMonthNames: string[] = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec" ];
    private monthNames: string[] = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December" ];
    private expenseTypeNames: string[] = [
        "Food",
        "House",
        "Entertainment",
        "Clothes",
        "Car",
        "Bills",
        "Other"
    ];
    private weekdayNames: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    isTheSameMonthAndYear(date1: Date, date2: Date): boolean {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }

    getEnumNumericKeys(enumType: any): number[] {
        return Object
            .keys(enumType)
            .filter(key => this.isIndex(key))
            .map(index => Number(index));
    }

    /*
    * Those methods 'get..names' are here so in the future it will be easier to add multi languages support.
    * */
    getMonthNames(): string[] {
        return this.monthNames;
    }

    getDayNames(): string[] {
        return this.weekdayNames;
    }

    getExpenseTypeNames(): string[] {
        return this.expenseTypeNames;
    }

    getshortMonthNames(): string[] {
        return this.shortMonthNames;
    }

    private  isIndex(key):boolean {
        let n = ~~Number(key);
        return String(n) === key && n >= 0;
    }
}