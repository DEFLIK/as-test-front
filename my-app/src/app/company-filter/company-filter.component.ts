import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, from } from 'rxjs';
import { CompanyItemComponent } from '../company-item/company-item.component';
import { CompanyListComponent } from '../company-list/company-list.component';
import { CompanyItem } from '../companyItem';

@Component({
  selector: 'app-company-filter',
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss']
})
export class CompanyFilterComponent implements OnInit {
  @Input() public linkedListComponent!: CompanyListComponent;
  public filterForm = new FormGroup({
    nameControl: new FormControl(''),
    typeControl: new FormControl('Все'),
  });

  constructor() { }

  ngOnInit(): void {
  }

  public onSubmit() {
    this.applyFilter();
  }

  public applyFilter() {
    this.linkedListComponent.nameToFilter = this.filterForm.value.nameControl;
    this.linkedListComponent.typeToFilter = this.filterForm.value.typeControl;
  }
}
