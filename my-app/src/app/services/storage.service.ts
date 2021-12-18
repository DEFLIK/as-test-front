import { Injectable, Output } from '@angular/core';
import { StorageReactable } from '../components/company-list/company-list.component';
import { CompanyItem } from '../models/companyItem';
import { CompanyItemsIndexer } from '../models/companyItemIndexer';
import { CacherService, CacheTypes } from './cacher.service';

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
  
  private _subscribers: Set<StorageReactable> = new Set();
  private _dataKey = 'companies';
  private _isLoaded = false;
  private _data: CompanyItem[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public loadStorage(type: string) { // Тут хорошо бы принимать CacheTypes, но не разобрался как сделать каст при передачи строки из темлпейта
    this._isLoaded = true;
    let loadedData = CacherService.getData(this._dataKey, type as CacheTypes);
    if(!loadedData) {
      this.storageChangeApply([]);
      return;
    }

    let res = JSON.parse(loadedData) as CompanyItem[];
    CompanyItemsIndexer.loadNewCompanyList(res);
    this.storageChangeApply(res);
  }

  public updateStorage(data: CompanyItem[], type: CacheTypes) {
    this._data = data;
    this.cacheCompanyItems(type);
  }

  public clearSelectedStorage(type: string) {
    this._data = [];
    CacherService.clearData(type as CacheTypes);
    this.storageChangeApply([]);
  }

  private cacheCompanyItems(type: CacheTypes) {
    CacherService.cacheData(this._dataKey, this.data, type);
  }

  @Output()
  public registerOnStorageChanged(item: StorageReactable): void {
    this._subscribers.add(item);
  }

  @Output()
  public unregisterOnStorageChanged(item: StorageReactable): void {
    this._subscribers.delete(item);
  }
  
  private async storageChangeApply(data: CompanyItem[]) {
    for (let func of this._subscribers) {
      func.storageChangedReaction.call(func, data);
    }
  }
}
