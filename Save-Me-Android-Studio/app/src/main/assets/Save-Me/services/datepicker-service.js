/*
* This class service is responsible for handling the JQuery UI DatePicker
* */
var DatepickerService = (function () {
    function DatepickerService() {
    }
    /*
    * Load an element with suplied id to bcome datepicker.
    * */
    DatepickerService.prototype.loadDatepicker = function (id, options) {
        var configurations = options ? options : this.getDefaultOptions(id);
        $("#" + id).datepicker(configurations);
    };
    DatepickerService.prototype.getDatepickerDate = function (id) {
        return new Date($("#" + id).val());
    };
    DatepickerService.prototype.setDatepickerDate = function (id, date) {
        var datepicker = $("#" + id);
        datepicker.datepicker("setDate", date);
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