import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-land-info-modal',
  templateUrl: './land-info-modal.component.html',
  styleUrl: './land-info-modal.component.css'
})
export class LandInfoModalComponent implements OnInit {
  isVisible: boolean = false;
  @Input() item: any = [];
  stompClient: any;
  user!: any;
  transactionId: string = "";
  @Output() handleOk = new EventEmitter<any>

  constructor(
    private dataService: DataService,
    private modalService: NzModalService,
    private socketService: SocketService,
    private apiService: ApiService
  ) {
    this.stompClient = this.socketService.connect();
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/lock_land', (message: any) => {
        // this.getAreaDetail();
        // this.getProjectDetail();
      })
    })
  }

  ngOnInit(): void {
    this.dataService.isVisibleLandDetailModal.subscribe(status => this.isVisible = status);
  }

  getProjectDetail(): void {
    this.apiService.getProjectById(this.item.projectId).subscribe({
      next: (res: any) => {
      }
    })
  }

  getAreaDetail(): void {
    this.apiService.getAreaById(this.item.areaId).subscribe({
      next: (res: any) => {
      }
    })
  }

  handleCreateTransaction() {
    let request = {
      userId: this.user.id,
      landId: this.item.id
    }
    this.apiService.createTransaction(request).subscribe({
      next: (res: any) => {
        this.transactionId = res.data.id;
        this.item = {
          ...this.item,
          transactionId: res.data.id,
          code: res.data.code,
        }
        localStorage.setItem("item",JSON.stringify(this.item))
      }
    })
  }

  handleDeleteTransaction() {
    this.apiService.deleteTransaction(this.transactionId).subscribe({
      next: (res: any) => {
      }
    })
  }

  handleCancel() {
    console.log('hihi')
    this.handleDeleteTransaction();
    this.isVisible = false;
    this.dataService.changeStatusLandDetailModal(false);
  }

  async showConfirm() {
    let user = sessionStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
      if (this.user.isDeleted == 1) {
        await this.handleCreateTransaction();
        await this.modalService.confirm({
          nzTitle: 'Xác nhận đặt cọc',
          nzContent: 'Bạn có chắc muốn đặt cọc bất động sản này, sau khi ấn đồng ý, bất động sản sẽ được tạm khóa để bạn tiến hành quá trình thanh toán. Vui lòng cân nhắc kỹ !',
          nzOkText: 'Đồng ý',
          nzCancelText: 'Hủy',
          nzOnOk: () => {
            let formData = new FormData();
            formData.append("id", this.item.id);
            formData.append("status", '2');
            this.handleOk.emit(this.item)
            this.apiService.updateLandStatus(formData).subscribe({
              next: (res: any) => {
                this.stompClient.send("/app/lands_lock", {}, JSON.stringify(res))
              }
            })
            this.dataService.changeStatusLandDetailModal(false);
            this.dataService.changeStatusPaymentModal(true);
            localStorage.setItem("isPaymentOpen",JSON.stringify(true));
          },
          nzOnCancel: () => {
            this.handleDeleteTransaction();
          }
        })
      } else {
        this.dataService.changeStatusVerifyPhoneNumberModal(true);
      }
    } else {
      this.dataService.changeStatusLoginModal(true);
    }
  }
}
