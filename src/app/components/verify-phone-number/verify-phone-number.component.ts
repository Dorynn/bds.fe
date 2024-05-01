import { Component, OnInit } from '@angular/core';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html',
  styleUrl: './verify-phone-number.component.css'
})
export class VerifyPhoneNumberComponent implements OnInit {
  phoneNumber: string = '';
  otp: string = '';
  isVisible: boolean = false;
  userId: string = '';
  isSendPhoneNumber: boolean = false;
  isPhoneNotValid: boolean = false;
  isOtpNotValid: boolean = false;
  user!:any;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private msg: NzMessageService
  ){}

  ngOnInit(): void {
    this.dataService.isVisibleVerifyPhoneNumber.subscribe(status => this.isVisible = status);
    let stringUser = sessionStorage.getItem("user");
    if(stringUser){
      this.user = JSON.parse(stringUser);
    }
  }

  changePhoneNumber(){
    this.isPhoneNotValid = false;
  }

  getOtp(){
    let stringUser = sessionStorage.getItem("user");
    if (stringUser){
      let user = JSON.parse(stringUser);
      this.userId = user.id;
      let request = {
        phoneNumber: '+84 '+ this.phoneNumber.slice(1),
        userId: user.id
      }
      this.apiService.getOtp(request).subscribe({
        next: (res: any) => {
          console.log(res);
          // if (res.message == 'FAILED'){
          //   this.isPhoneNotValid = true;
          // }else{
            this.isSendPhoneNumber = true;
            this.isPhoneNotValid = false;
          // }
          
        }
      })
    }
  }

  verifyOtp(){
    let formData = new FormData();
    formData.append("otp", this.otp);
    formData.append("userId", this.userId)
    this.apiService.verifyOtp(formData).subscribe({
      next: (res: any) => {
        if (res.message == 'Veryfied') {
          this.msg.success("Xác thực thành công");
          this.isOtpNotValid = false;
          this.dataService.changeStatusVerifyPhoneNumberModal(false);
          this.isVisible = false;
          this.apiService.createUser({email: this.user.email, name: this.user.name}).subscribe({
            next: (res2:any) => {
              sessionStorage.setItem("user", JSON.stringify(res2.data))
            }
          })
        }
      }
    })
  }

  onCancel(): void {
    this.isVisible = false;
  }

  changeOtp(){
    this.isOtpNotValid = false;
  }
}
