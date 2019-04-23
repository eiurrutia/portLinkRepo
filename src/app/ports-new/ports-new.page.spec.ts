import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortsNewPage } from './ports-new.page';

describe('PortsNewPage', () => {
  let component: PortsNewPage;
  let fixture: ComponentFixture<PortsNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortsNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortsNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
