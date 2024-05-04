import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  role: string = ''
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ){
    dataService.isUser.subscribe(r => this.role = r)
    this.router.events.subscribe((e:any)=>{
      if(e instanceof NavigationEnd){
        if (e.url == '/'){
            router.navigateByUrl("/homepage")
        }
      } 
    })
  }
  
}
