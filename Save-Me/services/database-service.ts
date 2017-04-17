declare var localforage;

class DatabaseService {
    private expenseStoreName: string = 'expenses';
    private expensesStore: LocalForage;
    private databaseVersion: number = 2;
    private database;
    private readonly readWriteMode: string = "readwrite";
    private readonly readonlyMode: string = "readonly";

    constructor() {
        this.expensesStore = localforage.createInstance({
            driver      : localforage.INDEXEDDB,
            name        : this.expenseStoreName + 'DB',
            version     : 1.0,
            storeName   : this.expenseStoreName,
            description : 'stores all expenses'
        });
    }

    addExpenseToDB(expense: Expense, calback?) {
        expense.id = this.createId();
        this.expensesStore.setItem(expense.id, expense, calback);
    }

    removeExpenseFromDB(expense: Expense, calback?) {
        this.expensesStore.removeItem(expense.id, calback);
    }

    updateExpenseToDB(expense: Expense, calback?) {
        this.expensesStore.removeItem(expense.id, ()=>{
            this.expensesStore.setItem(expense.id, expense, calback);
        })
    }

    getAllExpenses(callback) {
        this.expensesStore.keys().then((items)=>{
            var promises  = items.map((item)=> { return this.expensesStore.getItem(item); });
            Promise.all(promises).then((results)=> {
                callback(results);
            });
        })
    }

    clearAll(calback?) {
        this.expensesStore.clear(calback);
    }

    private createId(): string {
        return new Date().getTime() + (Math.random() * 100).toString();
    }
}