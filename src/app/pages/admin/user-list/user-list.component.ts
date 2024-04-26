import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  userList: any = [];
  total:any=1;
  currentPage: any = 0;
  pageSize: any=10;
  search: string = '';

  constructor(
    private apiService: ApiService
  ){}
  
  ngOnInit(): void {
    this.getUserList({pageIndex: 0, pageSize: 10})
  }

  getUserList(params: any){
    this.apiService.getUserList(params).subscribe({
      next: (res: any) => {
        this.userList = res.data;
        this.total = res.totalRecords;
        this.currentPage= res.currentPage;
        this.pageSize = res.currentSize;
        console.log(this.userList);
      }
    })
  }

  handleChangePage(event: any){
    let params = {
      pageIndex:event-1,
      pageSize:this.pageSize
    }
    this.getUserList(params)
  }

  handleSearch(){
    this.getUserList({search: this.search});
  }
}
