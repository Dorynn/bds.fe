import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrl: './area-management.component.css'
})
export class AreaManagementComponent implements OnInit {
  total: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  areaList: any = [];
  searchAreaName: string = '';
  loading: boolean = false;
  projectList: any = [];
  filterParams: any = {
    areaName: '',
    projectId: '',
  }
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ){}
  
  ngOnInit():void {
    this.getAreaList({})
    this.getAllProject()
  }

  getAreaList(request:any){
    this.loading = true;
    this.apiService.getAreaList(request).subscribe({
      next: (res: any) => {
        this.areaList = res.data;
        this.total = res.totalRecords;
        this.currentPage = res.currentPage;
        this.pageSize = res.currentSize;
        this.loading = false;
      }
    })
  }

  getAllProject(){
    this.apiService.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res.data;
      }
    })
  }

  goToAddArea(){
    this.router.navigateByUrl('/add-area');
  }

  goToEditArea(id: string){
    this.router.navigateByUrl(`/edit-area/${id}`)
  }

  handleChangePage(e: any){
    this.getAreaList({pageIndex: e-1, pageSize: this.pageSize})
  }

  handleSearch(){
    this.getAreaList({areaName: this.searchAreaName})
  }

  handleSearchByProject(){
    if(this.filterParams.projectId == undefined){
      this.filterParams.projectId = '';
    }
    this.getAreaList(this.filterParams);
  }
}
