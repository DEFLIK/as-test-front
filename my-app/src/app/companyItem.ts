import { CompanyDetails } from "./companyDetails";

export class CompanyItem {
    constructor(
        public suffix: string,
        public name: string,
        public id: Number,
        public logo: string,
        public industry: string,
        public type: string,
        public latitude: Number,
        public longitude: Number,
        public details: CompanyDetails
    ) {}
}