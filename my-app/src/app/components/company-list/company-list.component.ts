import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CompanyDetails } from '../../models/companyDetails';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl } from '@angular/forms';
import { SortMethods } from 'src/app/pipes/sort.pipe';
import { EndPointData, InfoRequesterService } from 'src/app/services/info-requester.service';
import { StorageService } from 'src/app/services/storage.service';
import { CacheTypes } from 'src/app/services/cacher.service';
import { CompanyItem } from 'src/app/models/companyItem';
import { CompanyItemsIndexer } from 'src/app/models/companyItemIndexer';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Output()
export class CompanyListComponent implements OnInit, OnDestroy, StorageReactable {
  public sortTypes = SortMethods;
  public sortType!: SortMethods;
  public nameToFilter!: string;
  public typeToFilter!: string;
  public companyTypes!: Set<string>;
  public cacheTypes!: CacheTypes;

  public get companyItems() {
    return this._companyItems;
  };
  public get storageService() {
    return this._storageService;
  };
  public get cacheControl() {
    return this._cacheControl;
  }
  public get countControl() {
    return this._countControl;
  };

  @ViewChild(CdkVirtualScrollViewport, {static: false}) 
  private virtualScrollViewPort!: CdkVirtualScrollViewport;
  private _companyItems: CompanyItem[] = [];
  private _storageService: StorageService;
  private _cacheControl = new FormControl();
  private _countControl = new FormControl();
  private onAppendingState = false;
  
  
  constructor(
    private requestService: InfoRequesterService,
    storageService: StorageService
    ) { this._storageService = storageService }

  public ngOnDestroy() {
    this._storageService.unregisterOnStorageChanged(this);
  }

  public ngOnInit(): void {
    this.onAppendingState = true;

    this._cacheControl.setValue(CacheTypes.session);
    this._countControl.setValue(50);

    // Закидываю в конец очереди через timeout, чтобы дать модулю виртуальной прокрукти 
    // загрузиться первым, перед тем как вкладывать в него дату и вызывать его рефреш
    setTimeout(() => {
      this._storageService.registerOnStorageChanged(this);
      this._storageService.loadStorage(this._cacheControl.value);
      this.onAppendingState = false;
    });
  }

  public checkForScrollEnd() {
    if (this.onAppendingState) {
      return;
    }

    const scrollEnd = this.virtualScrollViewPort.getRenderedRange().end;
    const scrollLength = this.virtualScrollViewPort.getDataLength();
    console.log();
    if (scrollEnd >= scrollLength) {
      this.appendInfo();
    }
  }

  public storageChangedReaction(data: CompanyItem[]) {
    if (!data) {
      this.appendInfo();
      return;
    }

    this._companyItems = data;

    if (this._companyItems.length === 0) {
      this.appendInfo();
    }

    this.virtualScrollViewPort.scrollToIndex(0);
    this.companyTypes = new Set(this._companyItems.map(item => item.type));
    this.refreshVirtualScroll();
  }

  public async refreshVirtualScroll() {
    this.virtualScrollViewPort.setRenderedRange({
      start: 0, 
      end: this.virtualScrollViewPort.getRenderedRange().end + 1
    });
    this.virtualScrollViewPort.checkViewportSize();
    // Здесь для обновления виртуального списка переопределяется лист с инфой через spread, 
    // сложность O(N), из-за чего может быть затратно при большом кол-ве информации
    // Но, похоже, иных способов затригерить обновление cdkVirtualScroll нет(
    // Поэтому закину эту операцию в другой поток
    // Также это поможет не срабатывать проверке на достижене конца списка, пока идет запрос новой информации
    this._companyItems = await [...this._companyItems];
    this.onAppendingState = false;
  }

  private appendInfo() {
    this.onAppendingState = true;

    this.requestService
      .getInfo(Number(this._countControl.value))
      .subscribe((data) => {
        this.initializeCompanyItems(data);
        this._storageService.updateStorage(this._companyItems, this._cacheControl.value);
        this.refreshVirtualScroll();
      });
  }

  private initializeCompanyItems(data: EndPointData[]): void {
    for (let item of data) {
      let companyDetails = new CompanyDetails(
        item.bs_company_statement,
        item.buzzword,
        item.catch_phrase,
        item.duns_number,
        item.employee_identification_number,
        item.full_address,
        item.phone_number,
        item.uid
      )
      
      let companyItem = new CompanyItem(
        item.suffix,
        item.business_name, 
        item.id,
        item.logo,
        item.industry,
        item.type,
        item.latitude,
        item.longitude,
        companyDetails
      )
      
      CompanyItemsIndexer.bindCompanyItem(item.id, companyItem);
      this._companyItems.push(companyItem);
    }
    this.companyTypes = new Set(this._companyItems.map(item => item.type));
  }
}

export interface StorageReactable {
  storageChangedReaction: (data: CompanyItem[]) => void;
}