declare var google:any;

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  user!:any;
  role!: string;
  isSpinning: boolean = true;
  iSSpinningUser: boolean = false;

  constructor(
    private dataService: DataService
  ){
    let stringUser = sessionStorage.getItem("user");
    if(stringUser){
      this.user = JSON.parse(stringUser);
      this.dataService.setRole(this.user?.role?.name);
    }
  }

  ngOnInit(): void {    
    console.log('open');
    this.dataService.isUser.subscribe((role: string)=> this.role = role)
    this.dataService.isLoadingAdmin.subscribe(status=>this.isSpinning=status)
    this.dataService.isLoadingUser.subscribe(status=> this.iSSpinningUser=status)
  }
  
}
