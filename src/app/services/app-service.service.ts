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

  createRecipe(user: any, id: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/users/addrecipe', { user, id });
  }

  getAllRecipes(): Observable<any> {
    return this.http.get<any>(this.BaseUrl + '/recipes');
  }

  searchRecipes(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.BaseUrl}/recipes/search?term=${searchTerm}`);
  }

  getRecipe(id: any): Observable<any>{
    return this.http.get(`${this.BaseUrl}/recipes/recipedetail/${id}`);
  }

  addComment(comment: any, id: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/recipes/addComment', { comment, id });
  }

  logout() {
    localStorage.clear();
  }

}
