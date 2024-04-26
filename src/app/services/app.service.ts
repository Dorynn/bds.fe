declare var google: any;
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  router = inject(Router)
  constructor() { }

  signOut(){
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem("loginInf");
    sessionStorage.removeItem("user");
    this.router.navigate(['/homepage']);
  }
}
