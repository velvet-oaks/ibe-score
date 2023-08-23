import { TestBed } from '@angular/core/testing';

import { UploadDialogService } from './upload-dialog.service';

describe('UploadDialogService', () => {
  let service: UploadDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
