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
    // google.accounts.id.initialize({
    //   client_id: '',
    //   callback: (res: any) => {

    //   }
    // });

    // let check = document.getElementById("btn-test");
    // console.log(check);
    
    // google.accounts.id.renderButton(document.getElementById("google-btn"), {
    //   theme: 'filled_blue',
    //   size: 'large',
    //   shape: 'rectangle',
    //   width: 350,
    // })
  }
  
}
