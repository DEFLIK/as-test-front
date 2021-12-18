import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheTypes } from '../cacher.service';
import { CompanyItem } from '../companyItem';
import { CompanyItemsIndexer } from '../companyItemIndexer';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  public notFound = false;
  public companyItem!: CompanyItem;

  constructor(private route: ActivatedRoute, private storage: StorageService) {}

  ngOnInit(): void {
    let itemId = Number(this.route.snapshot.paramMap.get('id'));
    let res = CompanyItemsIndexer.getCompanyItem(itemId);
    if (res) {
      this.companyItem =  res;
    } else if (!this.storage.isLoaded) {
      this.storage.loadStorage(CacheTypes.local);
      res = CompanyItemsIndexer.getCompanyItem(itemId);
      if(!res) {
        this.notFound = true;
      } else {
        this.companyItem = res;
      }
    }
  }

}
