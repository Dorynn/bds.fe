import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-project-information-modal',
  templateUrl: './project-information-modal.component.html',
  styleUrl: './project-information-modal.component.css'
})
export class ProjectInformationModalComponent implements OnInit {
  isVisible: boolean = false;
  @Input() item!:any;

  constructor(
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.dataService.isProjectInformationModal.subscribe(status => this.isVisible = status);
  }

  handleCancel(){
    this.isVisible = false
  }

  handleOk(){

  }
}
