import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppServiceService } from '../services/app-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  name =  localStorage.getItem('currentUser');
  recipes !: any[];
  recipeIds !: any[];
  searchForm !: FormGroup;
  res = "";
  searchTerm: string = '';

  constructor(private authService : AuthService, private appService : AppServiceService, 
    private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.searchForm = this.formBuilder.group({
      searchTerm: ['']
    });
    this.loadRecipes();
  }

  loadRecipes(){
    this.res = '';
    const userId = localStorage.getItem('user_id');
    this.appService.getAllRecipes(userId).subscribe(
      (response) => {
        console.log(response);
        this.recipes = response.result;
        this.recipeIds = response.recipeIDs;
        for(let i=0;i<this.recipes.length;i++){
          for(let j=0;j<this.recipeIds.length;j++){
            if(this.recipes[i].id == this.recipeIds[j].recipe_id){
                this.recipes[i].bookmarked=true;
                break;
            }
            else{
              this.recipes[i].bookmarked=false;
            }
          }
        }
        console.log(this.recipes);
        console.log(this.recipeIds);
        
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }

  searchRecipes(){
    this.searchTerm = this.searchForm.value.searchTerm;
    if (this.searchTerm) {
      this.appService.searchRecipes(this.searchTerm).subscribe(
        (response) => {
          if(response.filteredResult.length == 0){
            this.recipes = response.filteredResult;
            this.res="No Results Found";
          }
          else{
            this.recipes = response.filteredResult;
            console.log(response.filteredResult);
          }
        },
        (error) => {
          console.error('Error searching recipes:', error);
        }
      );
    } else {
      this.loadRecipes();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.searchTerm = '';
    this.loadRecipes();
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
            this.recipes[i].bookmarked = false;
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
