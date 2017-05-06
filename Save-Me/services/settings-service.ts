class SettingsService {
    private settings: Settings;
    private databaseService: DatabaseService = new DatabaseService();

    constructor() {
        $('#' + IdService.settingsCurrencyId).selectmenu();
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
        $('#' + IdService.settingsNameId).val(this.settings.name);
        $('#' + IdService.settingsBudgetId).val(this.settings.budget);
        $('#' + IdService.settingsCurrencyId + " option:selected").prop("selected", false);
        $('#' + IdService.settingsCurrencyId + ' option[value=' + this.settings.currency + ']').prop('selected', true);
        $('#' + IdService.settingsCurrencyId).selectmenu('refresh');
    }

    saveChanges(calback) {
        this.settings = this.getSettingsFromView();
        this.databaseService.setSettings(this.settings, calback)
    }

    getSettings() {
        return this.settings;
    }

    private getSettingsFromView(): Settings {
        this.settings.budget = $('#' + IdService.settingsBudgetId).val() || 0;
        this.settings.currency = $('#' + IdService.settingsCurrencyId + " option:selected").val();
        this.settings.name = $('#' + IdService.settingsNameId).val();

        return this.settings;
    }
}