import { CompanyItem } from "./companyItem";

export class CompanyItemsIndexer {
    private static readonly companies: Map<Number, CompanyItem> = new Map();

    constructor () {}

    public static getCompanyItem(id: Number) {
        return this.companies.get(id);
    }

    public static bindCompanyItem(id: Number, details: CompanyItem) {
        this.companies.set(id, details);
    }

    public static clearAllItems() {
        this.companies.clear();
    }

    public static loadNewCompanyList(data: CompanyItem[]) {
        this.companies.clear();
        for (let item of data) {
            this.bindCompanyItem(item.id, item);
        }
    }
}