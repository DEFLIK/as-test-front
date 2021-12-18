import { CompanyItem } from "./companyItem";

// Вроде бы стоит вынести в сервисы, но это статичный класс и, вроде как, нет смысла делать его сервисом
// Аналогично реализован статичный класс по кешированию данных, там он выполнен в виде сервиса.
// Первый проект на ангуляре и не очень понимаю, как лучше поступить, поэтому сделал сразу два варианта) 
// Подскажешь как правильно в тг?
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
        this.clearAllItems();
        for (let item of data) {
            this.bindCompanyItem(item.id, item);
        }
    }
}