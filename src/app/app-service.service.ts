import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private BaseUrl='http://localhost:3000';

  constructor(private http: HttpClient) { }

  register(formData: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/users/register', formData)
  };

  login(formData: any) : Observable<any> {
    return this.http.post(this.BaseUrl + '/users/login', formData);
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

}
