import { Pipe, PipeTransform } from '@angular/core';
import { CompanyItemComponent } from './company-item/company-item.component';
import { CompanyItem } from './companyItem';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  
  transform(companyItems: CompanyItem[], name: string, type: string): any {
    if (!companyItems || (!name && !type)) {
      return companyItems;
    }

    let res = companyItems.filter(x => x.name.includes(name));
    if (type !== 'Все') {
      res = res.filter(x => x.type === type);
    }
    return res;
  }
}
