import { TestBed } from '@angular/core/testing';

import { CacherService } from './cacher.service';

describe('CacherService', () => {
  let service: CacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
