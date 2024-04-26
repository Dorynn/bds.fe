import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLandComponent } from './edit-land.component';

describe('EditLandComponent', () => {
  let component: EditLandComponent;
  let fixture: ComponentFixture<EditLandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
