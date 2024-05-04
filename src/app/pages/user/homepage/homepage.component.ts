import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

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
  pageSize: number = 10;
  provinceList: any = [];
  projectType: string = '';
  provinceId:string='';
  typeList: any = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.getProjectList({pageIndex: 0, pageSize:10});
    this.getProvincesHaveProject();
    this.getType()
  }

  getProvincesHaveProject(){
    this.apiService.getProvincesHaveProject().subscribe({
      next: (res: any) => {
        this.provinceList = res.data;
      }
    })
  }

  getProjectList(params: any):void {
    this.dataService.changeStatusLoadingUser(true);
    this.apiService.getProjectList(params).subscribe({
      next: (res: any) => {
        this.projectList = res.data;
        this.total = res.totalRecords;
        this.currentPage = res.currentPage;
        this.pageSize = res.currentSize;
        this.dataService.changeStatusLoadingUser(false);
      },
      error: (err: any) => {
        this.dataService.changeStatusLoadingUser(false);
        this.projectList = []
      }
    })
  }

  getType(){
    this.apiService.getType().subscribe({
      next: (res: any) => {
        this.typeList = res.data;
      }
    })
  }

  goToProjectDetail(id: string):void {
    this.router.navigateByUrl(`/project-detail/${id}`)
  }

  handleChangePage(e: any) {
    this.apiService.getProjectList({pageIndex: e-1, pageSize: this.pageSize}).subscribe({
      next: (res: any) => {
        this.currentPage = e-1;
        this.projectList = res.data;
      }
    })
  }

  handleFilter(){
    let params = {
      pageIndex:0,
      pageSize: 10,
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
    this.getProjectList({pageSize:10})
  }

}
