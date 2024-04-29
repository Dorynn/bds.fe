import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.css'
})
export class ProjectManagerComponent implements OnInit {
  projectList: any = [];
  total: number= 0;
  currentPage: number = 0;
  pageSize: number = 10;
  searchProjectName: string = ''

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit():void {
    this.getProjectList({});
  }

  getProjectList(params: any) {
    this.apiService.getProjectList(params).subscribe({
      next: (res: any) => {
        this.total = res.totalRecords;
        this.currentPage = res.currentPage
        this.projectList = res.data;
      }
    })
  }

  handleChangePage(e: any) {
    this.apiService.getProjectList({pageIndex: e-1, pageSize: this.pageSize}).subscribe({
      next: (res: any) => {
        this.projectList = res.data
      }
    })
  }

  goToAddProject() {
    this.router.navigateByUrl('/add-project')
  }

  goToEditProject(id: string) {
    this.router.navigateByUrl(`/edit-project/${id}`)
  }

  handleSearch(){
    this.getProjectList({nameProject: this.searchProjectName})
  }
}
