import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyYandexMapComponent } from './components/company-yandex-map/company-yandex-map.component';

const routes: Routes = [
  { path: 'list', component: CompanyListComponent},
  { path: 'detail/:id', component: CompanyDetailComponent},
  { path: 'map', component: CompanyYandexMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
