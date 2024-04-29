declare var google: any;
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @Output() statusChange = new EventEmitter<boolean>();
  @Output() checkLogin = new EventEmitter<any>();
  isVisible!: boolean;
  isConfirmLoading = false;
  isEmpty: boolean = false;
  isInvalid: boolean = false;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private msg: NzMessageService,
    private router: Router
  ) {
    this.dataService.isVisibleLoginModal.subscribe(status => this.isVisible = status)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '612650383457-uvm6i6c4juhrma96b3eih4ld7up2mnan.apps.googleusercontent.com',
      callback: (res: any) => this.handleLogin(res)
    });

    let check = document.getElementById("google-btn")
    google.accounts.id.renderButton(document.getElementById("googleSignInButtonContainer"), {
      theme: 'outline',
      size: 'medium',
      shape: 'rectangle',
      width: 800,
      text: 'Đăng nhập với google'
    })

  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any) {
    if (response) {
      const payload = this.decodeToken(response.credential);
      let user = JSON.stringify(payload)
      sessionStorage.setItem("loginInf", user)
      this.checkLogin.emit(payload);
      this.isVisible = false;
      let request = {
        email: payload.email,
        name: payload.name,
      }
      
      this.apiService.createUser(request).subscribe({
        next: (res: any) => {
          this.msg.success('Đăng nhập thành công!')
          sessionStorage.setItem("user", JSON.stringify(res.data)); 
          if(res.data.phone == null){
            this.dataService.changeStatusVerifyPhoneNumberModal(true);
          }
          if(res.data.role.name === 'ADMIN'){
            this.router.navigateByUrl("/user")
            this.dataService.setRole('ADMIN')
          }
        }
      })
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.statusChange.emit(false)
  }

  handleOnchange(): void {
    this.isInvalid = false;
    this.isEmpty = false;
  }

  showRegisterModal() {
    this.dataService.changeStatusLoginModal(false);
    this.dataService.changeStatusRegisterModal(true);
  }
}
