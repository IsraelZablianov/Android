/*
* Types of expenses
* */
enum ExpenseType {
    Food,
    House,
    Entertainment,
    Clothes,
    Car,
    Bills,
    Other
}

/*
* Types of available charts
* */
enum ChartType {
    Months,
    ExpenseType
}

/*
* Types of sort for the list of expenses in home page.
* */
enum SortType {
    Date,
    Price
}

/*
* Configuration object for the bar line chart.
* */
interface BarLineConfig {
    currency: string;
    xaxis: any[];
}

/*
* Settings .
* */
class Settings {
    id?: string;
    name: string;
    currency: string;
    budget: number;
}

/*
 * Expense type description
 * */
class Expense {
    date: Date;
    price: number;
    comments: string;
    expenseType: ExpenseType;
    id: string;
}

/*
* extentions
* */
interface JQueryStatic {
    jqplot: any;
}
