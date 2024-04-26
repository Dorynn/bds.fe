import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandInfoBoxComponent } from './land-info-box.component';

describe('LandInfoBoxComponent', () => {
  let component: LandInfoBoxComponent;
  let fixture: ComponentFixture<LandInfoBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandInfoBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandInfoBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
