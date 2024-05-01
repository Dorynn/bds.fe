import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  phoneNumber: string = '';
  password: string = '';

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private router: Router,
    private msg: NzMessageService
  ){}

  handleLogin(){
    let request = {
      phone: this.phoneNumber,
      password: this.password
    }

    this.apiService.loginAdmin(request).subscribe({
      next: (res1: any) => {
        localStorage.setItem("token", res1.data);
        this.apiService.getAdminInf(res1.data).subscribe({
          next: (res: any) => {
            this.dataService.setAdminInf(res.data);
            this.dataService.setRole(res.data.role);
            this.router.navigateByUrl("/user");
            localStorage.setItem("admin", JSON.stringify(res.data));
          }
        })
      }
    })
  }

  
}
