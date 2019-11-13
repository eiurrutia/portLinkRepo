import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdsPage } from './thirds.page';

describe('ThirdsPage', () => {
  let component: ThirdsPage;
  let fixture: ComponentFixture<ThirdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThirdsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
