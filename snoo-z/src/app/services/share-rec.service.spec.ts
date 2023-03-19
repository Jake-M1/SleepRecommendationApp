import { TestBed } from '@angular/core/testing';

import { ShareRecService } from './share-rec.service';

describe('ShareRecService', () => {
  let service: ShareRecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareRecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
