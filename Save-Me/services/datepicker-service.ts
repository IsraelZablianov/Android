/*
* This class service is responsible for handling the JQuery UI DatePicker
* */
class DatepickerService {

    /*
    * Load an element with suplied id to bcome datepicker.
    * */
    loadDatepicker(id: string, options?: any){
        let configurations = options ? options : this.getDefaultOptions(id);
        $("#" + id).datepicker(configurations);
    }

    getDatepickerDate(id: string): Date {
        return new Date($("#" + id).val());
    }

    setDatepickerDate(id: string, date: Date): void{
        let datepicker = $("#" + id);
        datepicker.datepicker("setDate", date);
    }

    private getDefaultOptions(id: string): any {
        let options = {
            altField  : "#" + id,
            altFormat : 'DD - dd MM yy',
        };

        return options;
    }
}