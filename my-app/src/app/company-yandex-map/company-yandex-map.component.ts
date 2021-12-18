import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CacheTypes } from '../cacher.service';
import { StorageReactable } from '../company-list/company-list.component';
import { CompanyItem } from '../companyItem';
import { StorageService } from '../storage.service';

// Для нормальной инициализации я использую тайпинги из интернета
// ymaps.d.ts
@Component({
  selector: 'app-company-yandex-map',
  templateUrl: './company-yandex-map.component.html',
  styleUrls: ['./company-yandex-map.component.scss']
})
export class CompanyYandexMapComponent implements OnInit, OnDestroy, StorageReactable {
  @Output() linkedCompanyItems!: CompanyItem[];
  @Output() public cacheControl = new FormControl();
  @Output() public storageService: StorageService;
  private map!: any;
  private clusterer!: ymaps.Clusterer;
  private collection!: ymaps.GeoObjectCollection;
  private placemarks: Map<Number, ymaps.Placemark> = new Map();
  

  constructor(
    storageService: StorageService
    ) { this.storageService = storageService; }

  public async ngOnInit() {
    await ymaps.ready().then(() => { 
      this.initMap();
      this.cacheControl.setValue(CacheTypes.session);
      this.storageService.registerOnStorageChanged(this);
      this.storageService.loadStorage(this.cacheControl.value);
    });
  }

  public ngOnDestroy(): void {
    this.storageService.unregisterOnStorageChanged(this);
  }

  public storageChangedReaction(data: CompanyItem[]) {
    this.linkedCompanyItems = data;
    this.removeMarkers();
    this.addMarkers(data);
  }

  private initMap() {
    this.map = new ymaps.Map(
      'map-main', 
      {
        center: [56.981750014637555,49.34446269050328],
        zoom: 2
      }
    )
    this.collection =  new ymaps.GeoObjectCollection();
    this.clusterer = new ymaps.Clusterer();

    this.map.geoObjects.add(this.clusterer);
    this.map.geoObjects.add(this.collection);

    this.addMarkers(this.storageService.data);
  }

  private addMarkers(data: CompanyItem[]) {
    let newPlacemarks = this.initializeGeoObjects(data);
    this.clusterer.add(newPlacemarks);
  }

  private removeMarkers() {
    this.clusterer.removeAll();
    this.collection.removeAll();
  }

  public centerPlacemark(id: Number) {
    let coord = this.placemarks.get(id)?.geometry?.getCoordinates();
    if (!coord) {
      return;
    }

    this.map.setCenter(coord as number[]);
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
      this.placemarks.set(item.id, newPlacemark);
    }

    return newPlacemarks
  }
}
