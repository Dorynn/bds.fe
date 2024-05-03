import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-transaction-management',
  templateUrl: './transaction-management.component.html',
  styleUrl: './transaction-management.component.css'
})
export class TransactionManagementComponent implements OnInit {
  transactionList: any = [];
  total: number = 0;
  currentPage: number = 0;
  currentSize: number = 10;
  landName: string = '';
  status: number = 0;
  confirmModal?: NzModalRef;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private msg: NzMessageService,
    private modalService: NzModalService
  ) { }

  ngOnInit(): void {
    this.getTransactionList({})
  }

  getTransactionList(params: any) {
    this.apiService.getTransactionList(params).subscribe({
      next: (res: any) => {
        this.transactionList = res.data;
        this.total = res.totalRecords;
        this.currentPage = res.currentPage;
        this.currentSize = res.currentSize;
      }
    })
  }

  transformDate(data: any) {
    let date = ''
    date = data.slice(11, 16) + ' - ' + data.slice(8, 10) + '/' + data.slice(5, 7) + '/' + data.slice(0, 4)
    return date
  }

  goToViewTransaction(id: string) {
    this.router.navigateByUrl(`/view-transaction/${id}`)
  }

  handleChangePage(e: any) {
    let param = {
      pageIndex: e - 1,
      pageSize: 10
    }
    this.getTransactionList(param)
  }

  handleSearchByStatus() {
    if (this.status == null) {
      this.getTransactionList({});
    } else {
      this.getTransactionList({ status: this.status })
    }
  }

  handleSearch() {
    this.getTransactionList({ searchByLandName: this.landName })
  }

  updateTransactionStatus(id: string, status: string){
    let formData = new FormData();
    formData.append("id",id);
    formData.append("status",status);
    this.apiService.updateTransaction(formData).subscribe({
      next: (res: any) => {
        this.msg.success('Cập nhật giao dịch thành công!')
        this.getTransactionList({});
      },
      error: (err: any) => {
        this.msg.error('Cập nhật giao dịch thất bại!')
      }
    })
  }

  updateLandStatus(id: string, status: string){
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    this.apiService.updateLandStatus(formData).subscribe({
      next: (res: any) => {
      }
    })
  }

  changeTransactionStatus(id: string, landId: string, status: string, landStatus: string) {
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Bạn có chắc muốn thực hiện thay đổi này',
      nzContent: 'Trạng thái giao dịch sẽ được cập nhật sau khi nhấn đồng ý',
      nzOnOk: () => {
        this.updateLandStatus(landId, landStatus);
        this.updateTransactionStatus(id, status);
      }
        
    });


  }
}
