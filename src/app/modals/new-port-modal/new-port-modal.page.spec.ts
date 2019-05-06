import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPortModalPage } from './new-port-modal.page';

describe('NewPortModalPage', () => {
  let component: NewPortModalPage;
  let fixture: ComponentFixture<NewPortModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPortModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPortModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
