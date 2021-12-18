import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CompanyItem } from 'src/app/models/companyItem';
import { CacheTypes } from 'src/app/services/cacher.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageReactable } from '../company-list/company-list.component';

// Для нормальной инициализации я использую тайпинги из интернета
// ymaps.d.ts
@Component({
  selector: 'app-company-yandex-map',
  templateUrl: './company-yandex-map.component.html',
  styleUrls: ['./company-yandex-map.component.scss']
})
export class CompanyYandexMapComponent implements OnInit, OnDestroy, StorageReactable {
  public get linkedCompanyItems() {
    return this._linkedCompanyItems;
  };
  public get cacheControl() {
    return this._cacheControl;
  };
  public get storageService() {
    return this._storageService
  };

  private _linkedCompanyItems!: CompanyItem[];
  private _cacheControl = new FormControl();
  private _storageService: StorageService;
  private _map!: any;
  private _clusterer!: ymaps.Clusterer;
  private _collection!: ymaps.GeoObjectCollection;
  private _placemarks: Map<Number, ymaps.Placemark> = new Map();

  constructor(
    storageService: StorageService
    ) { this._storageService = storageService; }

  public async ngOnInit() {
    await ymaps.ready().then(() => { 
      this.initMap();
      this._cacheControl.setValue(CacheTypes.session);
      this._storageService.registerOnStorageChanged(this);
      this._storageService.loadStorage(this._cacheControl.value);
    });
  }

  public ngOnDestroy(): void {
    this._storageService.unregisterOnStorageChanged(this);
  }

  public storageChangedReaction(data: CompanyItem[]) {
    this._linkedCompanyItems = data;
    this.removeMarkers();
    this.addMarkers(data);
  }

  public centerPlacemark(id: Number) {
    let coord = this._placemarks.get(id)?.geometry?.getCoordinates();
    if (!coord) {
      return;
    }

    this._map.setCenter(coord as number[]);
  }

  private initMap() {
    this._map = new ymaps.Map(
      'map-main', 
      {
        center: [56.981750014637555,49.34446269050328],
        zoom: 2
      }
    )
    this._collection =  new ymaps.GeoObjectCollection();
    this._clusterer = new ymaps.Clusterer();

    this._map.geoObjects.add(this._clusterer);
    this._map.geoObjects.add(this._collection);

    this.addMarkers(this._storageService.data);
  }

  private addMarkers(data: CompanyItem[]) {
    let newPlacemarks = this.initializeGeoObjects(data);
    this._clusterer.add(newPlacemarks);
  }

  private removeMarkers() {
    this._clusterer.removeAll();
    this._collection.removeAll();
  }

  private initializeGeoObjects(data: CompanyItem[]): ymaps.Placemark[] {
    let newPlacemarks = [];

    for (let item of data) {
      let newPlacemark = new ymaps.Placemark([item.latitude, item.longitude], {
              'iconCaption': item.name,
              'hintContent': 'Нажмите, чтобы посмотреть детали',
              'id': item.id,
              'balloonContentBody':
              '<div style="display: flex; flex-direction:column">' +
                `<img src="${item.logo}" style="width: 100px">` +
                `<label>Название: ${item.name}</label>` +
                `<label>Вид деятельности: ${item.industry}</label>` +
                `<label>Слоган: ${item.details.catch_phrase}</label>` +
                `<label>Номер: ${item.details.phone_number}</label>` +
                `<label>Адресс: ${item.details.full_address}</label>` +
              '</div>'
          }, {
              'balloonPanelMaxMapArea': 0,
              'preset': 'islands#blueIcon',
              'openEmptyBalloon': true,
              'openBalloonOnClick': true
          });

      newPlacemarks.push(newPlacemark);
      this._placemarks.set(item.id, newPlacemark);
    }

    return newPlacemarks
  }
}
