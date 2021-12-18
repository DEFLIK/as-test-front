import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfoRequesterService {
  constructor(private http: HttpClient) { }

  public getInfo(count: number) {
    console.log('got', count)
    return this.http.get<EndPointData[]>(`https://random-data-api.com/api/company/random_company?size=${count}`);;
  }
}

export interface EndPointData {
  bs_company_statement: string
  business_name: string
  buzzword: string
  catch_phrase: string
  duns_number: string
  employee_identification_number: string
  full_address: string
  id: number
  industry: string
  latitude: number
  logo: string
  longitude: number
  phone_number: string
  suffix: string
  type: string
  uid: string
}
