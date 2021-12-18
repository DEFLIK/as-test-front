import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CompanyItem } from '../companyItem';
import { EndPointData, InfoRequesterService } from '../info-requester.service';
import { CompanyDetails } from '../companyDetails';
import { CompanyItemsIndexer } from '../companyItemIndexer';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SortMethods } from '../sort.pipe';
import { CacheTypes } from '../cacher.service';
import { FormControl } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Output()
export class CompanyListComponent implements OnInit, OnDestroy, StorageReactable {
  @Output() public sortTypes = SortMethods;

  @Output() public companyItems: CompanyItem[] = [];
  @Output() public sortType!: SortMethods;
  @Output() public nameToFilter!: string;
  @Output() public typeToFilter!: string;
  @Output() public companyTypes!: Set<string>;
  @Output() public storageService: StorageService;
  @Output() public cacheTypes!: CacheTypes;
  @Output() public cacheControl = new FormControl();
  @Output() public countControl = new FormControl();

  @ViewChild(CdkVirtualScrollViewport, {static: false}) 
  private virtualScrollViewPort!: CdkVirtualScrollViewport;
  private onAppendingState = false;
  
  
  constructor(
    private requestService: InfoRequesterService,
    storageService: StorageService
    ) { this.storageService = storageService }

  public ngOnDestroy() {
    console.log('lsit destroyed');
    this.storageService.unregisterOnStorageChanged(this);
  }

  public ngOnInit(): void {
    console.log('inited list', this);
    this.onAppendingState = true;

    this.cacheControl.setValue(CacheTypes.session);
    this.countControl.setValue(50);

    // Закидываю в конец очереди через timeout, чтобы дать модулю виртуальной прокрукти 
    // загрузиться первым, перед тем как вкладывать в него дату и вызывать его рефреш
    setTimeout(() => {
      this.storageService.registerOnStorageChanged(this);
      this.storageService.loadStorage(this.cacheControl.value);
      this.onAppendingState = false;
    });
  }

  private appendInfo() {
    this.onAppendingState = true;

    this.requestService
      .getInfo(Number(this.countControl.value))
      .subscribe((data) => {
        this.initializeCompanyItems(data);
        this.storageService.updateStorage(this.companyItems, this.cacheControl.value);
        this.refreshVirtualScroll();
        console.log('appending done', this.companyItems.length)
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
      console.log('List: scroll end')
      this.appendInfo();
    }
  }

  public storageChangedReaction(data: CompanyItem[]) {
    if (!data) {
      console.log('List: got no data, appending')
      this.appendInfo();
      return;
    }
    console.log('List: data got', data.length)

    this.companyItems = data;

    if (this.companyItems.length === 0) {
      console.log('List: got empty data, appending');
      this.appendInfo();
    }

    this.virtualScrollViewPort.scrollToIndex(0);
    this.companyTypes = new Set(this.companyItems.map(item => item.type));
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
    this.companyItems = await [...this.companyItems];
    this.onAppendingState = false;
    console.log('List: refreshing...');
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
      this.companyItems.push(companyItem);
    }
    this.companyTypes = new Set(this.companyItems.map(item => item.type));
  }
}

export interface StorageReactable {
  storageChangedReaction: (data: CompanyItem[]) => void;
}