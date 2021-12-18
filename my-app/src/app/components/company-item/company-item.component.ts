import { Component, Input, OnInit } from '@angular/core';
import { CompanyItem } from 'src/app/models/companyItem';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss']
})
export class CompanyItemComponent implements OnInit {
  @Input() public companyItem!: CompanyItem;

  constructor() {}

  ngOnInit(): void {
  }
}
