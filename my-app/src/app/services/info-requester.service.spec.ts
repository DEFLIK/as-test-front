import { TestBed } from '@angular/core/testing';

import { InfoRequesterService } from './info-requester.service';

describe('InfoRequesterService', () => {
  let service: InfoRequesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoRequesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
