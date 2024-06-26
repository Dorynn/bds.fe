declare var google:any;

import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @Output() checkLogin = new EventEmitter<any>()
  isVisible: boolean = false;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private msg: NzMessageService,
    private router: Router
  ){
    this.dataService.isVisibleRegisterModal.subscribe(status=>this.isVisible = status)
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '612650383457-uvm6i6c4juhrma96b3eih4ld7up2mnan.apps.googleusercontent.com',
      callback: (res: any) => this.handleSignUp(res)
    });

    google.accounts.id.renderButton(document.getElementById("googleSignUpButtonContainer"), {
      theme: 'outline',
      size: 'medium',
      shape: 'rectangle',
      width: 800,
      text: 'signup_with'
    })
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleSignUp(response: any){
    if(response){
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
  }

  handleCancel(){
    this.isVisible = false;
    this.dataService.changeStatusRegisterModal(false);
  }

  showLoginModal(){
    this.dataService.changeStatusRegisterModal(false);
    this.dataService.changeStatusLoginModal(true);
  }

  // loginWithGoogle() {
  //   this.dataService.changeStatusVerifyPhoneNumberModal(true)
  // }
}
