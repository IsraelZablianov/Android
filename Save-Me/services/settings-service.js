var SettingsService = (function () {
    function SettingsService() {
        this.settingsNameId = 'settings-name';
        this.settingsBudgetId = 'settings-budget';
        this.settingsCurrencyId = 'settings-select-currency';
        this.databaseService = new DatabaseService();
        $('#' + this.settingsCurrencyId).selectmenu();
    }
    SettingsService.prototype.loadSettings = function (calback) {
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
            if (calback) {
                calback();
            }
        });
    };
    SettingsService.prototype.setSettingsToView = function () {
        $('#' + this.settingsNameId).val(this.settings.name);
        $('#' + this.settingsBudgetId).val(this.settings.budget);
        $('#' + this.settingsCurrencyId + " option:selected").prop("selected", false);
        $('#' + this.settingsCurrencyId + ' option[value=' + this.settings.currency + ']').prop('selected', true);
        $('#' + this.settingsCurrencyId).selectmenu('refresh');
    };
    SettingsService.prototype.saveChanges = function (calback) {
        this.settings = this.getSettingsFromView();
        this.databaseService.setSettings(this.settings, calback);
    };
    SettingsService.prototype.getSettings = function () {
        return this.settings;
    };
    SettingsService.prototype.getSettingsFromView = function () {
        this.settings.budget = $('#' + this.settingsBudgetId).val() || 0;
        this.settings.currency = $('#' + this.settingsCurrencyId + " option:selected").val();
        this.settings.name = $('#' + this.settingsNameId).val();
        return this.settings;
    };
    return SettingsService;
}());
//# sourceMappingURL=settings-service.js.map