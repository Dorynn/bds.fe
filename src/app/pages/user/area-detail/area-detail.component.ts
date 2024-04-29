import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'app-area-detail',
  templateUrl: './area-detail.component.html',
  styleUrl: './area-detail.component.css'
})
export class AreaDetailComponent implements OnInit {
  projectId: string | null = this.route.snapshot.paramMap.get('id');
  areaId: string | null = this.route.snapshot.paramMap.get('area-id')
  projectDetail: any = [];
  areaList: any = [];
  areaDetail: any = [];
  item: any = [];
  stompClient: any;
  user: any = {};
  landList: any = [];
  filterParams:any = {
    areaId: this.areaId,
    price: '',
    status: '',
    typeOfApartment: '',
    direction: '',
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalService: NzModalService,
    private router: Router,
    private socketService: SocketService
  ) {
  }

  connectSocket(){
    this.stompClient = this.socketService.connect();
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/block_land', (message: any) => {
        console.log(message);
        this.getAreaDetail();
      })
      this.stompClient.subscribe('/topic/unlock_land', (message: any) => {
        console.log(message);
        this.getAreaDetail();
      })
    })
  }

  ngOnInit(): void {
    this.connectSocket()
    this.getAreaDetail()
    this.getProjectDetail();
    let isPaymentOpen = localStorage.getItem("isPaymentOpen");
    let item = localStorage.getItem("item");
    let user = sessionStorage.getItem("user");
    if (user){
      this.user = JSON.parse(user);
    }
    if(isPaymentOpen==='true'){
      if(item){
        this.item = JSON.parse(item)
        this.dataService.changeStatusPaymentModal(false);
        this.handleChangeLandStatus('1', this.item.id)
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

  getAreaDetail(): void {
    this.dataService.changeStatusLoadingUser(true);
    this.apiService.getAreaById(this.areaId).subscribe({
      next: (res: any) => {
        this.areaDetail = res.data;
        this.landList = res.data.lands;
        this.dataService.changeStatusLoadingUser(false);
      },
      error: (res: any) => {
        this.dataService.changeStatusLoadingUser(false);
      }
    })
  }

  getLandByAreaId():void {
    this.apiService.getLandByAreaId(this.filterParams).subscribe({
      next: (res: any) => {
        this.landList = res.data;
      },
      error: (err: any) => {

      }
    })
  }

  openLandDetailModal(item: any) {
    this.item = {
      ...item,
      projectName: this.projectDetail.name,
      projectId: this.projectDetail.id,
      areaName: this.areaDetail.name,
      areaId: this.areaDetail.id,
      expiryDate: this.areaDetail.expiryDate,
      investor: this.projectDetail.investor,
      price: item.price,
      deposit: item.deposit,
      description: item.description,
      acreage: item.acreage,
      hostBank: this.projectDetail.hostBank,
      bankName: this.projectDetail.bankName,
      bankNumber: this.projectDetail.bankNumber,
      phone: this.user.phone,
      type: this.projectDetail.projectType.name,
      qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit * 100}&des=${this.user.phone}+${item.name}`

    };
    this.dataService.changeStatusLandDetailModal(true);
  }

  showConfirm(item: any): void {
    let user = sessionStorage.getItem("user");
    console.log(user);
    
    if(user != null){
      this.user = JSON.parse(user);
      if (this.user.isDeleted == 1){
        this.item = {
          ...item,
          projectName: this.projectDetail.name,
          projectId: this.projectDetail.id,
          areaName: this.areaDetail.name,
          areaId: this.areaDetail.id,
          expiryDate: this.areaDetail.expiryDate,
          investor: this.projectDetail.investor,
          price: item.price,
          deposit: item.deposit,
          description: item.description,
          acreage: item.acreage,
          hostBank: this.projectDetail.hostBank,
          bankName: this.projectDetail.bankName,
          bankNumber: this.projectDetail.bankNumber,
          phone: this.user.phone,
          type: this.projectDetail.projectType.name,
          qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit * 100}&des=${this.user.phone}+${item.name}`
    
        };
        this.modalService.confirm({
          nzTitle: 'Xác nhận đặt cọc',
          nzContent: 'Bạn có chắc muốn đặt cọc bất động sản này, sau khi ấn đồng ý, bất động sản sẽ được tạm khóa để bạn tiến hành quá trình thanh toán. Vui lòng cân nhắc kỹ !',
          nzOkText: 'Đồng ý',
          nzCancelText: 'Hủy',
          nzOnOk: () => {
            this.openPaymentModal();
            this.handleChangeLandStatus('2', item.id)
            localStorage.setItem('isPaymentOpen',JSON.stringify(true))
            localStorage.setItem('item', JSON.stringify(this.item))
          },
          nzOnCancel: () => {
    
          }
    
        })
      }else {
        this.dataService.changeStatusVerifyPhoneNumberModal(true);
      }
    }else{
      this.dataService.changeStatusLoginModal(true);
    }
  }

  openPaymentModal(): void {
    this.dataService.changeStatusPaymentModal(true);
  }

  handleChangeArea(item: any) {
    this.areaId = item.id;
    this.getAreaDetail();
  }

  handleChangeLandStatus(status: string, id: string) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    this.apiService.updateLandStatus(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        console.log(status);
        if (status == '2') {
          this.stompClient.send("/app/lands_lock", {}, JSON.stringify(this.item))
        }
        if (status == '1') {
          this.stompClient.send("/app/lands_unlock", {}, JSON.stringify(this.item))
        }
      }
    })
  }

  handleReload(event: any) {
    if (event.isCancel) {
      this.handleChangeLandStatus('1', event.itemId)
    }
  }

  handleSearch():void {
    this.getLandByAreaId();
  }

  handleClearFilter():void {
    this.filterParams.price = '';
    this.filterParams.status = '';
    this.filterParams.direction = '';
    this.filterParams.typeOfApartment = '';
    this.getAreaDetail();
  }
}
