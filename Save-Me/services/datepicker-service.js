var DatepickerService = (function () {
    function DatepickerService() {
    }
    DatepickerService.prototype.loadDatepicker = function (id, options) {
        var configurations = options ? options : this.getDefaultOptions(id);
        this.getDatepickerElement(id).datepicker(configurations);
    };
    DatepickerService.prototype.getDatepicker = function (id) {
        return new Date(this.getDatepickerElement(id).val());
    };
    DatepickerService.prototype.setDatepicker = function (id, date) {
        var datepicker = this.getDatepickerElement(id);
        datepicker.datepicker("setDate", date);
    };
    DatepickerService.prototype.getDatepickerElement = function (id) {
        var selector = "#" + id;
        var datepicker = $(selector);
        return datepicker;
    };
    DatepickerService.prototype.getDefaultOptions = function (id) {
        var options = {
            altField: "#" + id,
            altFormat: 'DD - dd MM yy',
        };
        return options;
    };
    return DatepickerService;
}());
//# sourceMappingURL=datepicker-service.js.map