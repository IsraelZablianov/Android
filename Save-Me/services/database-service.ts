declare var localforage;

class DatabaseService {
    private expenseStoreName: string = 'expenses';
    private settingsStoreName: string = 'settings';
    private settingsStore: LocalForage;
    private expensesStore: LocalForage;
    private databaseVersion: number = 2;
    private readonly settingsId: string = 'settings-id';

    constructor() {
        this.expensesStore = localforage.createInstance({
            driver      : localforage.INDEXEDDB,
            name        : this.expenseStoreName + 'DB',
            version     : 1.0,
            storeName   : this.expenseStoreName,
            description : 'stores all expenses'
        });

        this.settingsStore = localforage.createInstance({
            driver      : localforage.INDEXEDDB,
            name        : this.settingsStoreName + 'DB',
            version     : this.databaseVersion,
            storeName   : this.settingsStoreName,
            description : 'User Settings'
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

    setSettings(settings: Settings, calback?) {
        settings.id = this.settingsId;
        this.settingsStore.setItem(settings.id, settings, calback);
    }

    getSettings(calback) {
        this.settingsStore.getItem(this.settingsId).then((settings)=>{
            calback(settings);
        });
    }

    private createId(): string {
        return new Date().getTime() + (Math.random() * 100).toString();
    }
}