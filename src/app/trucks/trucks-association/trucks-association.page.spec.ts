import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksAssociationPage } from './trucks-association.page';

describe('TrucksAssociationPage', () => {
  let component: TrucksAssociationPage;
  let fixture: ComponentFixture<TrucksAssociationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrucksAssociationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksAssociationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
