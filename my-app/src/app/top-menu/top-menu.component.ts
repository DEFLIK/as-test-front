import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CompanyListComponent } from '../company-list/company-list.component';
import { InfoRequesterService } from '../info-requester.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
