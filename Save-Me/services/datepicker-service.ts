/*
* This class service is responsible for handling the JQuery UI DatePicker
* */

class DatepickerService {

    /*
    * Load an element with supplied id to become datepicker.
    * */
    loadDatepicker(id: string, options?: any){
        let configurations = options ? options : this.getDefaultOptions(id);
        $("#" + id).datepicker(configurations);
    }

    /*
    * Returns the date of specified datepicker
    * */
    getDatepickerDate(id: string): Date {
        return new Date($("#" + id).val());
    }

    /*
     * set the date of specified datepicker
     * */
    setDatepickerDate(id: string, date: Date): void{
        let datepicker = $("#" + id);
        datepicker.datepicker("setDate", date);
    }

    /*
    * Returns a default option object for initializing the date pickers.
    * */
    private getDefaultOptions(id: string): any {
        let options = {
            altField  : "#" + id,
            altFormat : 'DD - dd MM yy',
        };

        return options;
    }
}