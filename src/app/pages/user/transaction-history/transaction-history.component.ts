import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  transactionList: any = [];
  item!: any;
  user!:any;
  tabs = [{status: 0, label:'Chờ xác nhận'}, {status:1, label:'Thanh toán thành công'}, {status:2, label:'Thanh toán thất bại'}];
  loading: boolean = false

  constructor(
    private apiService: ApiService,
    private dataService: DataService
  ){}

  ngOnInit(): void {
    console.log('transaction');
    let stringUser = sessionStorage.getItem("user");
    if(stringUser){
      console.log(stringUser);
      
      let user = JSON.parse(stringUser);
      this.user = user;
      console.log(user);
      this.getTransactionOfUser(0);
      
    }
    
  }

  getTransactionOfUser(status: number){
    this.loading = true;
    console.log(this.user);
    if(this.user){
      let params = {
        id: this.user?.id,
        status: status
      }
      this.apiService.getTransactionOfUser(params).subscribe({
        next: (res:any) => {
          this.transactionList = res.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        }
      })
    }
  }

  getProjectDetail(id: any) {
    this.apiService.getProjectById(id).subscribe({
      next: (res: any) => {
        this.item.type = res.data.projectType.name,
        this.item.investor = res.data.investor
      }
    })
  }

  getLandById(item: any){
    this.dataService.changeStatusLandDetailModal(true);
    this.getProjectDetail(item.areaDTO.projectId)
    this.item = {
      ...item,
      projectName: item.areaDTO.projectName,
      areaName: item.areaDTO.name
    }
  }

  changeTab(event: any) {
    this.getTransactionOfUser(event); 
  }
}
