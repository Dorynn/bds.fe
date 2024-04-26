import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from '../../../services/data.service';
import { CountdownEvent } from 'ngx-countdown/interfaces';
import { SocketService } from '../../../services/socket.service';
import { debug } from 'console';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  projectId: string | null = this.route.snapshot.paramMap.get('id');
  projectDetail: any = {}
  areaList: any = [];
  item: any = [];
  stompClient!: any;
  user: any = {}

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private dataService: DataService,
    private socketService: SocketService
  ) {

  }

  connectSocket(){
    this.stompClient = this.socketService.connect();
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/block_land', (message: any) => {
        console.log(message);
        this.getProjectDetail();
      })
      this.stompClient.subscribe('/topic/unlock_land', (message: any) => {
        console.log(message);
        this.getProjectDetail();
      })
    })
  }

  ngOnInit(): void {
    this.connectSocket();
    this.getProjectDetail();
    let isPaymentOpen = localStorage.getItem("isPaymentOpen");
    let item = localStorage.getItem("item");
    let user = sessionStorage.getItem("user");
    if(user){
      this.user = JSON.parse(user);
    }
    if (isPaymentOpen === 'true') {
      if (item) {
        this.item = JSON.parse(item)
        this.dataService.changeStatusPaymentModal(false);
        this.updateLandStatus('1', this.item.id)
      }
    }
  }

  getProjectDetail(): void {
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.projectDetail = res.data;
        this.areaList = res.data.areas;
      }
    })
  }

  showConfirm(item: any, area: any): void {
    let user = sessionStorage.getItem("user")
    if(user){
      this.user = JSON.parse(user);
      if (this.user.isDeleted == 1){
        this.item = {
          ...item,
          projectName: this.projectDetail.name,
          projectId: this.projectId,
          areaName: area.name,
          areaId: area.id,
          expiryDate: area.expiryDate,
          investor: this.projectDetail.investor,
          price: item.price,
          deposit: item.deposit,
          description: item.description,
          acreage: item.acreage,
          hostBank: this.projectDetail.hostBank,
          bankName: this.projectDetail.bankName,
          bankNumber: this.projectDetail.bankNumber,
          phone: this.user.phone,
          qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit * 100}&des=${this.user.phone}+${item.name}`
        };
        this.modalService.confirm({
          nzTitle: 'Xác nhận đặt cọc',
          nzContent: 'Bạn có chắc muốn đặt cọc bất động sản này, sau khi ấn đồng ý, bất động sản sẽ được tạm khóa để bạn tiến hành quá trình thanh toán. Vui lòng cân nhắc kỹ !',
          nzOkText: 'Đồng ý',
          nzCancelText: 'Hủy',
          nzOnOk: () => {
            this.getProjectDetail();
            this.openPaymentModal();
            this.updateLandStatus('2', item.id);
            localStorage.setItem('isPaymentOpen', JSON.stringify(true))
            localStorage.setItem('item', JSON.stringify(this.item))
          },
          nzOnCancel: () => {
          }
    
        })
      }else{
        this.dataService.changeStatusVerifyPhoneNumberModal(true);
      }
    }else{
      this.dataService.changeStatusLoginModal(true);
    }
  }

  updateLandStatus(status: string, id: string) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    this.apiService.updateLandStatus(formData).subscribe({
      next: (res: any) => {
        console.log(status);
        this.getProjectDetail();

        if (status == '2') {
          this.stompClient.send("/app/lands_lock", {}, JSON.stringify(this.item))
        }
        if (status == '1') {
          this.stompClient.send("/app/lands_unlock", {}, JSON.stringify(this.item))
        }
      }
    })
  }

  openPaymentModal() {
    this.dataService.changeStatusPaymentModal(true);
  }

  openLandDetailModal(item: any, area: any) {
    this.item = {
      ...item,
      projectName: this.projectDetail.name,
      projectID: this.projectDetail.id,
      areaName: area.name,
      areaId: area.id,
      investor: this.projectDetail.investor,
      price: item.price,
      deposit: item.deposit,
      description: item.description,
      acreage: item.acreage,
      hostBank: this.projectDetail.hostBank,
      bankName: this.projectDetail.bankName,
      bankNumber: this.projectDetail.bankNumber,
      phone: this.user.phone,
      qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit * 100}&des=${this.user.phone}+${item.name}`
    };
    this.dataService.changeStatusLandDetailModal(true);
  }

  handleReload(event: any) {
    console.log(event);
    
    if (event.isCancel) {
      this.updateLandStatus('1', event.itemId)
    }
  }
}
