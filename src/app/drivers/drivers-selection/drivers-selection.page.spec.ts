import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversSelectionPage } from './drivers-selection.page';

describe('DriversSelectionPage', () => {
  let component: DriversSelectionPage;
  let fixture: ComponentFixture<DriversSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
