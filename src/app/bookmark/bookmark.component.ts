import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit{
  name =  localStorage.getItem('currentUser');
  recipes !: any[];
  recipeIds !: any[];
  res = "";

  constructor(private authService : AuthService, 
    private appService : AppServiceService) {}

    ngOnInit(){
        this.loadRecipes();
    }

    loadRecipes(){
      const userId = localStorage.getItem('user_id');
      this.appService.getBookmark(userId).subscribe(
        (response) => {
          if(response.result.length == 0){
            this.res="No Bookmarks Found";
          }
          console.log(response);
          this.recipes = response.result;
          for(let i=0;i<this.recipes.length;i++){
            this.recipes[i].bookmarked = true;
          }
        },
        (error) => {
          console.error('Error fetching recipes:', error);
        }
      );
    }

    bookMark(recipeId:any){
      const userId = localStorage.getItem('user_id');
      this.appService.bookMarkRecipes(userId, recipeId).subscribe({
        next: (res: any) => {
            console.log(res);
            for(let i=0;i<this.recipes.length;i++){
              if(this.recipes[i].id === recipeId){
                this.recipes[i].bookmarked = true;
              }
            }
        },
        error: (err: any) => {
          console.log(err.error.message);
        }
      })
    }
  
    unMark(recipeId : any){
      const userId = localStorage.getItem('user_id');
      this.appService.unMarkRecipes(userId, recipeId).subscribe({
        next: (res: any) => {
          console.log(res);
          for(let i=0;i<this.recipes.length;i++){
            if(this.recipes[i].id === recipeId){
              this.loadRecipes();
            }
          }
        },
        error: (err: any) => {
          console.log(err.error.message);
        }
      })
    }
  
    logout() {
      this.authService.logout();
    }
  
}
