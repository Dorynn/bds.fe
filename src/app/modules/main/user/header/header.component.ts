declare var google: any;
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppService } from '../../../../services/app.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isOpenLogin: boolean = false;
  isOpenRegister:boolean = false;
  isLogin: boolean = false;
  user: any;
  constructor(
    private dataService: DataService,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let user = sessionStorage.getItem('loginInf')
    if(user){
      this.isLogin = true;
      this.user = JSON.parse(user)
    }
    this.dataService.isVisibleLoginModal.subscribe(status => this.isOpenLogin = status);
    this.dataService.isVisibleRegisterModal.subscribe(status=>this.isOpenRegister = status);
  }

  closeLogin() {
    this.isOpenLogin = false;
  }

  showModal(): void {
    this.dataService.changeStatusLoginModal(true);
    this.isOpenLogin = true;
  }

  showRegisterModal(): void {
    this.dataService.changeStatusRegisterModal(true);
  }

  handleLogout():void {
    console.log('logout');
    
    this.appService.signOut();
    this.isLogin = false;
  }

  checkLogin(e: any) {
    this.isLogin = true;
    this.user = e
  }

  goToTransaction(){
    this.router.navigateByUrl('/transaction-history')
  }
}
