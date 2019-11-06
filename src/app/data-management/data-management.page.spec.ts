import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataManagementPage } from './data-management.page';

describe('DataManagementPage', () => {
  let component: DataManagementPage;
  let fixture: ComponentFixture<DataManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
