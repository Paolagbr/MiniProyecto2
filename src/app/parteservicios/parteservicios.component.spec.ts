import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParteserviciosComponent } from './parteservicios.component';

describe('ParteserviciosComponent', () => {
  let component: ParteserviciosComponent;
  let fixture: ComponentFixture<ParteserviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParteserviciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParteserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
