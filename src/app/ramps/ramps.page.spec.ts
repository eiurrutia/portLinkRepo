import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RampsPage } from './ramps.page';

describe('RampsPage', () => {
  let component: RampsPage;
  let fixture: ComponentFixture<RampsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RampsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RampsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
