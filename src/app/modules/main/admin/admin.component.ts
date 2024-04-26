import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  isCollapsed = false;

  constructor(
    private appSerive: AppService
  ){}

  logout(){
    this.appSerive.signOut()
  }
}
