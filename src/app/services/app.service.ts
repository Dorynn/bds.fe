declare var google: any;
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  router = inject(Router)
  constructor(
    private dataService: DataService
  ) { }

  signOut() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem("loginInf");
    sessionStorage.removeItem("user");
    this.dataService.setRole("USER");
    this.router.navigate(['/homepage']);
  }
}
