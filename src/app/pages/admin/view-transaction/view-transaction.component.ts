import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.css'
})
export class ViewTransactionComponent implements OnInit {
  transactionId: string | null = this.route.snapshot.paramMap.get('id');
  transactionInf: any = [];
  status:string = '1';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getTransactionById()
  }

  getTransactionById() {
    this.apiService.getTransactionById(this.transactionId).subscribe({
      next: (res: any) => {
        this.transactionInf = res.data;
        this.status = String(res.data.status);
      }
    })
  }

  transformDate(data: any) {
    let date = ''
    date = data.slice(14) + ' - ' + data.slice(8, 10) + '/' + data.slice(5, 7) + '/' + data.slice(0, 4)
    return date
  }

  updateTransactionStatus(){
    console.log(this.status);
    let formData = new FormData();
    formData.append("id", String(this.transactionId));
    formData.append("status",this.status);
    this.apiService.updateTransaction(formData).subscribe({
      next: (res: any) => {
        this.msg.success('Cập nhật giao dịch thành công!')
        this.getTransactionById();
      },
      error: (err: any) => {
        this.msg.error('Cập nhật giao dịch thất bại!')
      }
    })
  }

  updateLandStatus(){
    let formData = new FormData();
    formData.append("id", this.transactionInf.land.id);
    formData.append("status", '3');
    this.apiService.updateLandStatus(formData).subscribe({
      next: (res: any) => {
        console.log('success', res);
      }
    })
  }

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Xác nhận đặt cọc',
      nzContent: 'Bạn có chắc muốn cập nhật giao dịch này, trạng thái giao dịch sẽ không thể thay đổi sau khi đồng ý',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.updateLandStatus();
        this.updateTransactionStatus();
      },
      nzOnCancel: () => {

      }
    })
  }
}
