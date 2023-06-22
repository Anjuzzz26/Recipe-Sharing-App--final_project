import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private router : Router, private authService : AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const currentUser = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    if(currentUser){
      if(this.authService.isLoggedIn()){
          return true;
      }
      else {
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}
