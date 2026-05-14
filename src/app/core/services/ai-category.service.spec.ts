import { TestBed } from '@angular/core/testing';

import { AiCategoryService } from './ai-category.service';

describe('AiCategoryService', () => {
  let service: AiCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
