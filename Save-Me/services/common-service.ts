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

    /*
    * Returns enum values.
    * */
    getEnumNumericKeys(enumType: any): number[] {
        return Object
            .keys(enumType)
            .filter(key => this.isIndex(key))
            .map(index => Number(index));
    }

    /*
    * Returns greeting message according to current time.
    * */
    getGreetingMessage(): string {
        var today = new Date();
        var curHr = today.getHours();

        if (curHr < 12) {
            return "Good Morning";
        } else if (curHr < 18) {
            return "Good Afternoon";
        } else {
            return "Good evening";
        }
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

    /*
    * Check if a given key is a number
    * */
    private  isIndex(key: any): boolean {
        let n = ~~Number(key);
        return String(n) === key && n >= 0;
    }
}