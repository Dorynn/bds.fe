import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataService } from '../../../services/data.service';
import { SocketService } from '../../../services/socket.service';
import { ViewportScroller } from '@angular/common';

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
  user: any = {};
  areaId: string = '';
  isSticky: boolean = false;
  transactionCode: string = '';
  transactionId: string = '';
  filterParams: any = {
    projectId: this.projectId,
    price: '',
    status: '',
    typeOfApartment: '',
    direction: '',
  };
  isOpenPayment: boolean = false;
  typeOfApartmentList: any = [];
  directionList: any = []

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset;
    const stickyPosition = 500;
    this.isSticky = scrollPosition >= stickyPosition
    // const footerPosition = 
  }

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private dataService: DataService,
    private socketService: SocketService,
    private viewportScroller: ViewportScroller
  ) {

  }

  connectSocket() {
    this.stompClient = this.socketService.connect();
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/block_land', (message: any) => {
        this.getProjectDetail();
      })
      this.stompClient.subscribe('/topic/unlock_land', (message: any) => {
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
    if (user) {
      this.user = JSON.parse(user);
    }
    if (isPaymentOpen == 'true') {
      if (item) {
        this.item = JSON.parse(item)
        this.dataService.changeStatusPaymentModal(false);
        this.updateLandStatus('1', this.item.id)
        this.handleDeleteTransaction(this.item.transactionId);
      }
    }

    this.dataService.isVisiblePaymentModal.subscribe(status => this.isOpenPayment = status);
    this.getTypeOfApartmentList();
    this.getDirectionList();
  }

  scrollToTop():void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  getProjectDetail(): void {
    this.dataService.changeStatusLoadingUser(true);
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.projectDetail = res.data;
        this.areaList = res.data.areas;
        this.dataService.changeStatusLoadingUser(false);
      },
      error: (err: any) => {
        this.dataService.changeStatusLoadingUser(false);
      }
    })
  }


  async showConfirm(item: any, area: any) {

    let user = sessionStorage.getItem("user")
    if (user) {
      this.user = JSON.parse(user);
      if (this.user.isDeleted == 1) {
        await this.handleCreateTransaction(item, area)
        await this.modalService.confirm({
          nzTitle: 'Xác nhận đặt cọc',
          nzContent: 'Bạn có chắc muốn đặt cọc bất động sản này, sau khi ấn đồng ý, bất động sản sẽ được tạm khóa để bạn tiến hành quá trình thanh toán. Vui lòng cân nhắc kỹ !',
          nzOkText: 'Đồng ý',
          nzCancelText: 'Hủy',
          nzOnOk: () => {
            this.updateLandStatus('2', item.id);
            localStorage.setItem('isPaymentOpen', JSON.stringify(true))
            localStorage.setItem('item', JSON.stringify(this.item))
            this.openPaymentModal();
          },
          nzOnCancel: () => {
            this.apiService.deleteTransaction(this.transactionId).subscribe({
              next: (res: any) => {
                console.log(res);
              }
            })
          }

        })
      } else {
        this.dataService.changeStatusVerifyPhoneNumberModal(true);
      }
    } else {
      this.dataService.changeStatusLoginModal(true);
    }
  }

  updateLandStatus(status: string, id: string) {
    let formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    this.apiService.updateLandStatus(formData).subscribe({
      next: (res: any) => {
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
      type: this.projectDetail.projectType.name,
      phone: this.user.phone,
      code: this.transactionCode,
      transactionId: this.transactionId,
      expiryDate: this.projectDetail.expiryDate,
      qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit}&des=${this.transactionCode}`
    };

    this.dataService.changeStatusLandDetailModal(true);
  }

  handleReload(event: any) {
    if (event.isCancel) {
      this.updateLandStatus('1', event.itemId)
      this.handleDeleteTransaction(event.transactionId);
    }
  }

  handleDeleteTransaction(id: string){
    this.apiService.deleteTransaction(id).subscribe({
      next: (res: any) => {
        localStorage.removeItem("isPaymentOpen")

      }
    })
  }

  handleCreateTransaction(item: any, area: any) {
    let request = {
      userId: this.user.id,
      landId: item.id
    }

    this.apiService.createTransaction(request).subscribe({
      next: (res: any) => {
        this.transactionCode = res.data.code;
        this.transactionId = res.data.id;
        this.item = {
          ...item,
          projectName: this.projectDetail.name,
          projectId: this.projectId,
          areaName: area.name,
          areaId: area.id,
          expiryDate: this.projectDetail.expiryDate,
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
          code: this.transactionCode,
          transactionId: res.data.id,
          qr: `https://qr.sepay.vn/img?acc=${this.projectDetail.bankNumber}&bank=${this.projectDetail.bankName}&amount=${item.deposit}&des=${this.transactionCode}`
        };
      }
    })

  }

  handleSearch(): void {
    // this.getLandByAreaId();
  }

  handleClearFilter(): void {
    this.filterParams.price = '';
    this.filterParams.status = '';
    this.filterParams.direction = '';
    this.filterParams.typeOfApartment = '';
    // this.getAreaDetail();
  }

  handleOkLandModel(event: any) {
    this.item = {
      ...this.item,
      code: event.code,
      transactionId: event.transactionId,
      qr: `https://qr.sepay.vn/img?acc=${event.bankNumber}&bank=${event.bankName}&amount=${event.deposit}&des=${event.code}`
    }

    console.log(this.item);
    
  }

  openProjectInformationModal(){
    this.dataService.changeStatusProjectInformationModal(true);
  }

  getTypeOfApartmentList(){
    this.apiService.getAllTypeOfApartment().subscribe({
      next: (res: any) => {
        this.typeOfApartmentList = res.data
      }
    })
  }

  getDirectionList(){
    this.apiService.getAllDirection().subscribe({
      next: (res: any) => {
        this.directionList = res.data;
      }
    })
  }

  handleFilterLand(){
    
    this.apiService.filterLandByProjectId(this.filterParams).subscribe({
      next: (res: any)=> {
      }
    })
  }

}
