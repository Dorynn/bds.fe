import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {

  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private msg: NzMessageService
  ){}
  
  handleSignUp(){
    let request = {
      name: "Đỗ Thị Linh",
      phone: "0962027042",
      email: "linh@gmail.com",
      password: "12345678"
    }

    this.apiService.signUpAdmin(request).subscribe({
      next: (res: any) => {
        this.msg.success("Đăng ký tài khoản thành công!");
        this.dataService.changeStatusLoginModal(true);
      }
    })
  }
}
