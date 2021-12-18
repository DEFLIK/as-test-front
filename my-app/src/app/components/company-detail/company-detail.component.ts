import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyItem } from 'src/app/models/companyItem';
import { CompanyItemsIndexer } from 'src/app/models/companyItemIndexer';
import { CacheTypes } from 'src/app/services/cacher.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  @Input() public companyItem!: CompanyItem;
  public get notFound() {
    return this._notFound;
  }

  private _notFound = false;

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
        this._notFound = true;
      } else {
        this.companyItem = res;
      }
    }
  }

}
