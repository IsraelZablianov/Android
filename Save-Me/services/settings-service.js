var SettingsService = (function () {
    function SettingsService() {
        this.databaseService = new DatabaseService();
    }
    /*
    * This function is loading the settings object
    * From the database if exists or creating default settings.
    * The function executing the supplied callback function if exists.
    * */
    SettingsService.prototype.loadSettings = function (callback) {
        var _this = this;
        this.databaseService.getSettings(function (settings) {
            if (settings) {
                _this.settings = settings;
            }
            else {
                _this.settings = new Settings();
                _this.settings.budget = 0;
                _this.settings.currency = '₪';
            }
            if (callback) {
                callback();
            }
        });
    };
    /*
    *  This function is responsible for setting the content of settings object to settings page.
    * */
    SettingsService.prototype.setSettingsToView = function () {
        $('#' + IdService.settingsNameId).val(this.settings.name);
        $('#' + IdService.settingsBudgetId).val(this.settings.budget);
        $('#' + IdService.settingsCurrencyId + " option:selected").prop("selected", false);
        $('#' + IdService.settingsCurrencyId + ' option[value=' + this.settings.currency + ']').prop('selected', true);
        $('#' + IdService.settingsCurrencyId).selectmenu('refresh');
    };
    /*
    * Setting the settings object to DB.
    * */
    SettingsService.prototype.saveChanges = function (calback) {
        this.settings = this.getSettingsFromView();
        this.databaseService.setSettings(this.settings, calback);
    };
    SettingsService.prototype.getSettings = function () {
        return this.settings;
    };
    SettingsService.prototype.getSettingsFromView = function () {
        this.settings.budget = $('#' + IdService.settingsBudgetId).val() || 0;
        this.settings.currency = $('#' + IdService.settingsCurrencyId + " option:selected").val();
        this.settings.name = $('#' + IdService.settingsNameId).val();
        return this.settings;
    };
    return SettingsService;
}());
//# sourceMappingURL=settings-service.js.map