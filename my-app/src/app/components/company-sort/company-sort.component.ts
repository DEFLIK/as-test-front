import { Component, Input, OnInit } from '@angular/core';
import { SortMethods } from 'src/app/pipes/sort.pipe';
import { CompanyListComponent } from '../company-list/company-list.component';

@Component({
  selector: 'app-company-sort',
  templateUrl: './company-sort.component.html',
  styleUrls: ['./company-sort.component.scss']
})
export class CompanySortComponent implements OnInit {
  @Input() public linkedListComponent!: CompanyListComponent;
  @Input() public sortType!: SortMethods;
  constructor() { }

  ngOnInit(): void {
  }

  public applySortToList() {
    this.linkedListComponent.sortType = this.sortType;
    this.linkedListComponent.refreshVirtualScroll();
    console.log('filter in list', this.linkedListComponent.sortType)
  }
}
