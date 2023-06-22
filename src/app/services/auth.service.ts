import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(user: any, token :any, id:any) {
    localStorage.setItem('currentUser', user);
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', id);
  }

  logout() {
    localStorage.clear();
  }

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
  }
}
