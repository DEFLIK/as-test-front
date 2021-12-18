import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CompanyListComponent } from '../company-list/company-list.component';

@Component({
  selector: 'app-company-filter',
  templateUrl: './company-filter.component.html',
  styleUrls: ['./company-filter.component.scss']
})
export class CompanyFilterComponent implements OnInit {
  @Input() public linkedListComponent!: CompanyListComponent;
  public get filterForm() {
    return this._filterForm;
  }

  private _filterForm = new FormGroup({
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
    this.linkedListComponent.nameToFilter = this._filterForm.value.nameControl;
    this.linkedListComponent.typeToFilter = this._filterForm.value.typeControl;
  }
}
