import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  projectList: any = [];
  currentPage: number = 0;
  total: number = 0;
  status: string ='';
  pageSize: number = 4;
  provinceList: any = [];
  projectType: string = '';
  provinceId:string='';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProjectList({pageIndex: 0, pageSize:4});
    this.getProvincesHaveProject()
  }

  getProvincesHaveProject(){
    this.apiService.getProvincesHaveProject().subscribe({
      next: (res: any) => {
        this.provinceList = res.data;
      }
    })
  }

  getProjectList(params: any):void {
    this.apiService.getProjectList(params).subscribe({
      next: (res: any) => {
        console.log(res);
        this.projectList = res.data;
        this.total = res.totalRecords;
        this.currentPage = res.currentPage;
        this.pageSize = res.currentSize;
      }
    })
  }

  

  goToProjectDetail(id: string):void {
    this.router.navigateByUrl(`/project-detail/${id}`)
  }

  handleChangePage(e: any) {
    console.log(e);
    this.apiService.getProjectList({pageIndex: e-1, pageSize: this.pageSize}).subscribe({
      next: (res: any) => {
        this.projectList = res.data
      }
    })
  }

  handleFilter(){
    let params = {
      pageIndex:0,
      pageSize: 4,
      status: this.status,
      provinceId: this.provinceId,
      projectTypeId: this.projectType
    }
    this.getProjectList(params);
  }

  handleClear(){
    this.status = '';
    this.provinceId = '';
    this.projectType = '';
    this.getProjectList({pageSize:4})
  }

}
