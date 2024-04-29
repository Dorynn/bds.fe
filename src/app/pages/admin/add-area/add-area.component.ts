import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrl: './add-area.component.css'
})
export class AddAreaComponent implements OnInit {
  areaName: string = '';
  projectId: string = '';
  projectList: any = [];
  timeLimit: string = '';

  constructor(
    private apiService: ApiService,
    private msg: NzMessageService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getProjectList();

  }

  getProjectList() {
    this.apiService.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res.data;
      }
    })
  }

  handleAddArea() {
    this.dataService.changeStatusLoadingAdmin(true)
    let request = {
      name: this.areaName,
      projectId: this.projectId,
      expiryDate: this.timeLimit
    }
    this.apiService.createArea(request).subscribe({
      next: (res: any) => {
        this.areaName = '';
        this.projectId = '';
        this.timeLimit = '';
        this.msg.success("Thêm mới phân khu thành công!")
        this.dataService.changeStatusLoadingAdmin(false);
      },
      error: (err: any) => {
        this.msg.error("Thêm mới phân khu thất bại")
        this.dataService.changeStatusLoadingAdmin(false);
      }
    })
  }
}
