import { Component, OnInit } from '@angular/core';
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

  constructor(
    private dataService: DataService,
    private apiService: ApiService
  ){}

  ngOnInit(): void {
    this.dataService.isVisibleVerifyPhoneNumber.subscribe(status => this.isVisible = status)
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
        
      }
    })
  }

  onCancel(): void {
    this.isVisible = false;
  }
}
