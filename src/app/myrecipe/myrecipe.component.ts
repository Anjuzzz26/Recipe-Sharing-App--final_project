import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppServiceService } from '../services/app-service.service';

@Component({
  selector: 'app-myrecipe',
  templateUrl: './myrecipe.component.html',
  styleUrls: ['./myrecipe.component.css']
})
export class MyrecipeComponent implements OnInit {
  name =  localStorage.getItem('currentUser');
  recipes !: any[];
  res = "";

  constructor(private authService : AuthService, 
    private appService : AppServiceService) {}

    ngOnInit(){
        this.loadRecipes();
    }

    loadRecipes(){
      const userId = localStorage.getItem('user_id');
      this.appService.getMyRecipe(userId).subscribe(
        (response) => {
          if(response.result.length == 0){
            this.res="No Recipes Found";
          }
          this.recipes = response.result;
        },
        (error) => {
          console.error('Error fetching recipes:', error);
        }
      );
    }

    delete(recipeId:any){
      if(window.confirm("Are you sure you want to delete?")) {
        this.appService.deleteRecipes(recipeId).subscribe({
          next: (res: any) => {
            console.log(res);
            window.alert('Recipe Deleted');
            this.loadRecipes();
          },
          error: (err: any) => {
            console.log(err.error.message);
          }
        })
      }
    }

    logout() {
      this.authService.logout();
    }

}
