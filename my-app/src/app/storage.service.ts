import { Injectable, Output } from '@angular/core';
import { CacherService, CacheTypes } from './cacher.service';
import { StorageReactable } from './company-list/company-list.component';
import { CompanyItem } from './companyItem';
import { CompanyItemsIndexer } from './companyItemIndexer';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  @Output() public cachingTypes = CacheTypes;
  @Output() public get data() {
    return this._data;
  }
  public get isLoaded() {
    return this._isLoaded
  }
  
  private subscribers: Set<StorageReactable> = new Set();
  private dataKey = 'companies';
  private _isLoaded = false;
  private _data: CompanyItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public loadStorage(type: string) { // Тут хорошо бы принимать CacheTypes, но не разобрался как сделать каст при передачи строки из темлпейта
    this._isLoaded = true;
    let loadedData = CacherService.getData(this.dataKey, type as CacheTypes);
    if(!loadedData) {
      console.log('Service: no data to load at', type)
      this.storageChangeApply([]);
      return;
    }

    let res = JSON.parse(loadedData) as CompanyItem[];
    CompanyItemsIndexer.loadNewCompanyList(res);
    console.log('Service: data loaded', type, res.length)
    this.storageChangeApply(res);
  }

  public updateStorage(data: CompanyItem[], type: CacheTypes) {
    console.log('Service: storage updated', type)
    this._data = data;
    this.cacheCompanyItems(type);
  }

  public clearSelectedStorage(type: string) {
    console.log('Service: clearing data at', type)
    this._data = [];
    CacherService.clearData(type as CacheTypes);
    this.storageChangeApply([]);
  }

  private cacheCompanyItems(type: CacheTypes) {
    CacherService.cacheData(this.dataKey, this.data, type);
    console.log(`Service: data cached to ${type}`)
  }

  @Output()
  public registerOnStorageChanged(item: StorageReactable): void {
    this.subscribers.add(item);
  }

  @Output()
  public unregisterOnStorageChanged(item: StorageReactable): void {
    this.subscribers.delete(item);
  }
  
  private async storageChangeApply(data: CompanyItem[]) {
    console.log('Service: applying change')
    for (let func of this.subscribers) {
      func.storageChangedReaction.call(func, data);
    }
  }
}
