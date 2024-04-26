import { inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, GuardResult, MaybeAsync, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';


export const authGuard: CanActivateFn = (route, state) => {
  let role = inject(DataService);
  let router = inject(Router)
  let userRole = ''
  role.isUser.subscribe(status => userRole = status)
console.log(userRole);

      if(userRole == 'ADMIN'){
        router.navigateByUrl("/user")
      }else{
        router.navigateByUrl("/homepage")
      }
      // return false;
  return true;
};

export const childGuard: CanActivateChildFn = (route, state) => {
  return true
}
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  role: string = ''
  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.isUser.subscribe(user => this.role = user)
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
  //   if(this.role == 'ADMIN'){
  //     this.router.navigateByUrl("/user")
  //   }else{
  //     this.router.navigateByUrl("/homepage")
  //   }
  //   return false;
  // }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  //   console.log(this.role);
    
  //     if(this.role == 'ADMIN'){
  //       this.router.navigateByUrl("/user")
  //     }else{
  //       this.router.navigateByUrl("/homepage")
  //     }
  //     return false;
  // }
  

}
