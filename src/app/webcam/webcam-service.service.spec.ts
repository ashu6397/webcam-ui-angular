import { TestBed } from '@angular/core/testing';

import { WebcamService } from './webcam-service.service';

describe('WebcamServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebcamService = TestBed.get(WebcamService);
    expect(service).toBeTruthy();
  });
});
