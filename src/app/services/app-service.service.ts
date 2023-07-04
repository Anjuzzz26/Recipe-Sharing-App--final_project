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

  createRecipe(recipe: any, id: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/users/addrecipe', { recipe, id });
  }

  getAllRecipes(id: any): Observable<any> {
    return this.http.get<any>(this.BaseUrl + `/recipes/${id}`);
  }

  searchRecipes(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.BaseUrl}/recipes/search/${searchTerm}`);
  }

  getRecipe(id: any): Observable<any>{
    return this.http.get(`${this.BaseUrl}/recipes/recipedetail/${id}`);
  }

  addComment(comment: any, id: any, recipe_id: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/recipes/addComment', { comment, id, recipe_id });
  }

  getComment(recipeId: any): Observable<any>{
    return this.http.get(`${this.BaseUrl}/recipes/comments/${recipeId}`);
  }

  bookMarkRecipes(user_id: any, recipe_id: any) : Observable<any> {
    return this.http.post(this.BaseUrl + '/recipes/bookmark', { user_id, recipe_id });
  }

  unMarkRecipes(user_id: any, recipe_id: any) : Observable<any> {
    const options = {
      params: {
        user_id: user_id,
        recipe_id: recipe_id
      }
    };
    return this.http.delete(this.BaseUrl + '/recipes/unmark', options);
  }

  deleteRecipes(recipe_id: any) : Observable<any> {
    const options = {
      params: {
        recipe_id: recipe_id
      }
    };
    return this.http.delete(this.BaseUrl + '/myrecipes/delete', options);
  }

  getBookmark(id: any): Observable<any>{
    return this.http.get(`${this.BaseUrl}/users/bookmark/${id}`);
  }

  getMyRecipe(id: any): Observable<any>{
    return this.http.get(`${this.BaseUrl}/users/myrecipes/${id}`);
  }

  updateRecipe(recipe: any, id: any): Observable<any> {
    return this.http.post(this.BaseUrl + '/users/editrecipe', { recipe, id });
  }

  logout() {
    localStorage.clear();
  }

}
