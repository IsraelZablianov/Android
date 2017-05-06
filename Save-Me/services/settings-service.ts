class SettingsService {
    private settingsNameId: string = 'settings-name';
    private settingsBudgetId: string = 'settings-budget';
    private settingsCurrencyId: string = 'settings-select-currency';
    private settings: Settings;
    private databaseService: DatabaseService = new DatabaseService();

    constructor() {
        $('#' + this.settingsCurrencyId).selectmenu();
    }

    loadSettings(calback?){
        this.databaseService.getSettings((settings)=>{
            if(settings) {
                this.settings = settings;
            }
            else {
                this.settings = new Settings();
                this.settings.budget = 0;
                this.settings.currency = '₪';
            }

            if(calback){
                calback();
            }
        });
    }

    setSettingsToView() {
        $('#' + this.settingsNameId).val(this.settings.name);
        $('#' + this.settingsBudgetId).val(this.settings.budget);
        $('#' + this.settingsCurrencyId + " option:selected").prop("selected", false);
        $('#' + this.settingsCurrencyId + ' option[value=' + this.settings.currency + ']').prop('selected', true);
        $('#' + this.settingsCurrencyId).selectmenu('refresh');
    }

    saveChanges(calback) {
        this.settings = this.getSettingsFromView();
        this.databaseService.setSettings(this.settings, calback)
    }

    getSettings() {
        return this.settings;
    }

    private getSettingsFromView(): Settings {
        this.settings.budget = $('#' + this.settingsBudgetId).val() || 0;
        this.settings.currency = $('#' + this.settingsCurrencyId + " option:selected").val();
        this.settings.name = $('#' + this.settingsNameId).val();

        return this.settings;
    }
}