import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyYandexMapComponent } from './company-yandex-map.component';

describe('CompanyYandexMapComponent', () => {
  let component: CompanyYandexMapComponent;
  let fixture: ComponentFixture<CompanyYandexMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyYandexMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyYandexMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
