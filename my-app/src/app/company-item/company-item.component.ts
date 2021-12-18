import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyDetailComponent } from '../company-detail/company-detail.component';
import { CompanyDetails } from '../companyDetails';
import { CompanyItem } from '../companyItem';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss']
})
export class CompanyItemComponent implements OnInit {
  @Input() public item!: CompanyItem;
  public itemDetails!: CompanyDetailComponent;

  constructor() {}

  ngOnInit(): void {
  }
}
