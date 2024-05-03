import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInformationModalComponent } from './project-information-modal.component';

describe('ProjectInformationModalComponent', () => {
  let component: ProjectInformationModalComponent;
  let fixture: ComponentFixture<ProjectInformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectInformationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
