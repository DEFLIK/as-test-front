import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacherService {
  constructor() { }

  public static cacheData(key: string, data: any, type: CacheTypes) {
    switch (type) {
      case(CacheTypes.local):
        localStorage.setItem(key, JSON.stringify(data));
        break;
      case(CacheTypes.session):
        sessionStorage.setItem(key, JSON.stringify(data));
        break;
    }
  }

  public static clearData(type: CacheTypes) {
    switch(type) {
      case(CacheTypes.local):
        localStorage.clear()
        break;
      case(CacheTypes.session):
        sessionStorage.clear();
        break;
    }
  }

  public static getData(key: string, type: CacheTypes): string {
    switch(type) {
      case(CacheTypes.local):
        return localStorage.getItem(key) as string;
      case(CacheTypes.session):
        return sessionStorage.getItem(key) as string;
    }
  }
}

export enum CacheTypes {
  session = 'Текущая сессия',
  local = 'Локальное'
}
