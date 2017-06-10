/*
* This class service is responsible for managing the user settings.
* */

class SettingsService {
    private settings: Settings;
    private databaseService: DatabaseService = new DatabaseService();

    /*
    * This function is loading the settings object
    * From the database if exists or creating default settings.
    * The function executing the supplied callback function if exists.
    * */
    loadSettings(callback?): void {
        this.databaseService.getSettings((settings)=>{
            if(settings) {
                this.settings = settings;
            }
            else {
                this.settings = new Settings();
                this.settings.budget = 0;
                this.settings.currency = '₪';
            }

            if(callback){
                callback();
            }
        });
    }

    /*
    *  This function is responsible for setting the content of settings object to settings page.
    * */
    setSettingsToView(): void {
        $('#' + IdService.settingsNameId).val(this.settings.name);
        $('#' + IdService.settingsBudgetId).val(this.settings.budget);
        $('#' + IdService.settingsCurrencyId + " option:selected").prop("selected", false);
        $('#' + IdService.settingsCurrencyId + ' option[value=' + this.settings.currency + ']').prop('selected', true);
        $('#' + IdService.settingsCurrencyId).selectmenu('refresh');
    }

    /*
    * Setting the settings object to DB.
    * */
    saveChanges(calback): void {
        this.settings = this.getSettingsFromView();
        this.databaseService.setSettings(this.settings, calback)
    }

    /*
    * Returns current settingsOr Undefined
    * */
    getSettings(): Settings {
        return this.settings;
    }

    /*
    * Gets tue user selected settings from settings page
    * */
    private getSettingsFromView(): Settings {
        this.settings.budget = $('#' + IdService.settingsBudgetId).val() || 0;
        this.settings.currency = $('#' + IdService.settingsCurrencyId + " option:selected").val();
        this.settings.name = $('#' + IdService.settingsNameId).val();

        return this.settings;
    }
}