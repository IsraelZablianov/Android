class DatepickerService {

    loadDatepicker(id: string, options?: any){
        let configurations = options ? options : this.getDefaultOptions(id);
        this.getDatepickerElement(id).datepicker(configurations);
    }

    getDatepicker(id: string): Date{
        return new Date(this.getDatepickerElement(id).val());
    }

    setDatepicker(id: string, date: Date): void{
        let datepicker = this.getDatepickerElement(id);
        datepicker.datepicker("setDate", date);
    }

    private getDatepickerElement(id: string){
        let selector = "#" + id;
        let datepicker = $(selector);

        return datepicker;
    }

    private getDefaultOptions(id: string): any {
        let options = {
            altField  : "#" + id,
            altFormat : 'DD - dd MM yy',
        };

        return options;
    }
}