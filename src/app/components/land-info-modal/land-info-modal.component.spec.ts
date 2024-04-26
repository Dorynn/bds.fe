import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandInfoModalComponent } from './land-info-modal.component';

describe('LandInfoModalComponent', () => {
  let component: LandInfoModalComponent;
  let fixture: ComponentFixture<LandInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandInfoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
