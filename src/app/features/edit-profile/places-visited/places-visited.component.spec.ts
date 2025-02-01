import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesVisitedComponent } from './places-visited.component';

describe('PlacesVisitedComponent', () => {
  let component: PlacesVisitedComponent;
  let fixture: ComponentFixture<PlacesVisitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacesVisitedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlacesVisitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
