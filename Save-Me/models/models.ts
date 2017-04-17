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

enum SortType{
    Date,
    Price
}

class Settings {

}