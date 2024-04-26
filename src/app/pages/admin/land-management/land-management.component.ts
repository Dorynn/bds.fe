import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-land-management',
  templateUrl: './land-management.component.html',
  styleUrl: './land-management.component.css'
})
export class LandManagementComponent implements OnInit {
  landList: any = [];
  projectList: any = [];
  areaList: any = [];
  name: string = '';
  total: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  requestParams: any = {
    name: '',
    projectId: '',
    areaId: ''
  };
  searchText: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getLandList({});
    this.getProjectList();
  }

  getProjectList(){
    this.apiService.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res.data
      }
    })
  }

  getAreaByProjectId(){
    this.apiService.getProjectById(this.requestParams.projectId).subscribe({
      next: (res: any) => {
        this.areaList = res.data
      }
    })
  }

  // getAreaList(){
  //   this.apiService.getAreaList()
  // }

  getLandList(request: any){
    this.apiService.getLandList(request).subscribe({
      next: (res: any) => {
        this.landList = res.data;
        this.total = res.totalRecords;
        this.currentPage = res.currentPage;
        this.pageSize = res.currentSize;
      }
    })

  }

  goToAddLand(){
    this.router.navigateByUrl('/add-land')
  }

  goToEditLand(id: string){
    this.router.navigateByUrl(`/edit-land/${id}`)
  }

  handleChangePage(e:any){
    let param = {
      pageIndex: e-1,
      pageSize: 10
    }
    this.getLandList(param)
  }

  handleSearch(){
    this.getLandList({searchName: this.requestParams.name})
  }

  searchByProject(){
    if(this.requestParams.projectId == null){
      this.getLandList({});
    }
    this.getLandList({projectId: this.requestParams.projectId})
  }

  searchByArea(){
    if(this.requestParams.areaId == null){
      this.getLandList({})
    }
    this.getAreaByProjectId();
    this.getLandList({areaId: this.requestParams.areaId});
  }
}
