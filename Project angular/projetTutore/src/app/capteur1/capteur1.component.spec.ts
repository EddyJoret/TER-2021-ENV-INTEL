import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Capteur1Component } from './capteur1.component';

describe('Capteur1Component', () => {
  let component: Capteur1Component;
  let fixture: ComponentFixture<Capteur1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Capteur1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Capteur1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
