class Expense {
    date: Date;
    price: number;
    comments: string;
    expenseType: ExpenseType;
    id: string;
}

enum ExpenseType {
    Food,
    House,
    Entertainment,
    Clothes,
    Car,
    Bills,
    Other
}

enum ChartType {
    Months,
    ExpenseType
}

enum SortType {
    Date,
    Price
}

interface BarLineConfig {
    currency: string;
    xaxis: any[];
}

class Settings {
    id?: string;
    name: string;
    currency: string;
    budget: number;
}

/* extentions */
interface JQueryStatic {
    jqplot: any;
}
