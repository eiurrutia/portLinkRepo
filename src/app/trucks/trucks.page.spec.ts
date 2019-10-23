import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksPage } from './trucks.page';

describe('TrucksPage', () => {
  let component: TrucksPage;
  let fixture: ComponentFixture<TrucksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrucksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
