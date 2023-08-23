import { TestBed } from '@angular/core/testing';

import { MultiUseDialogService } from './multi-use-dialog.service';

describe('MultiUseDialogService', () => {
  let service: MultiUseDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiUseDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
