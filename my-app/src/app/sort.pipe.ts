import { Pipe, PipeTransform } from '@angular/core';
import { CompanyItemComponent } from './company-item/company-item.component';
import { CompanyItem } from './companyItem';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(list: CompanyItem[], type: SortMethods): CompanyItem[] {
    if (!type) {
      return list;
    }
    
    list.sort(this.getMethodByType(type));
    return list;
  }

  private getMethodByType(type: SortMethods): (x: CompanyItem, y: CompanyItem) => number {
    switch (type) {
      case(SortMethods.name):
        return (x: CompanyItem, y: CompanyItem) => 
          x.name.localeCompare(y.name);
      case(SortMethods.type):
        return (x: CompanyItem, y: CompanyItem) => 
          x.type.localeCompare(y.type);
      case(SortMethods.industry):
        return (x: CompanyItem, y: CompanyItem) => 
          x.industry.localeCompare(y.industry);
      default:
        throw new Error(`Unknow sort method "${type}" catched`)
    }
  }
}

export enum SortMethods {
  name = "Имя",
  type = "Тип",
  industry = "Индустрия"
}
