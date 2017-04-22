class CommonService {
    isTheSameDate(date1: Date, date2: Date): boolean {
        return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }

    getEnumValues(enumType: any): number[] {
        return Object
            .keys(enumType)
            .filter(key => this.isIndex(key))
            .map(index => Number(index));
    }

    private  isIndex(key):boolean {
        let n = ~~Number(key);
        return String(n) === key && n >= 0;
    }
}