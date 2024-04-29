import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.css'
})
export class EditAreaComponent {
  name: string = '';
  projectName: string = '';
  projectId: string = '';
  projectList: any = [];
  timeLimit: string = '';
  areaId: string | null = this.route.snapshot.paramMap.get('id')

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getAreaById();
  }

  getAreaById() {
    this.apiService.getAreaById(this.areaId).subscribe({
      next: (res: any) => {
        this.name = res.data.name;
        this.projectName = res.data.projectName;
        this.timeLimit = res.data.expiryDate;
        this.projectId = res.data.projectId
      }
    })
  }



  handleEditArea() {
    this.dataService.changeStatusLoadingAdmin(true);
    let request = {
      id: this.areaId,
      name: this.name,
      projectId: this.projectId,
      expiryDate: this.timeLimit
    }
    this.apiService.updateArea(request).subscribe({
      next: (res: any) => {
        this.name = '';
        this.projectId = '';
        this.timeLimit = '';
        this.msg.success("Cập nhật phân khu thành công!")
        this.dataService.changeStatusLoadingAdmin(false);
      },
      error: (err: any) => {
        this.dataService.changeStatusLoadingAdmin(false);
        this.msg.success("Cập nhật phân khu thất bại!");
      }
    })
  }
}
