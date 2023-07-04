import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppServiceService } from '../services/app-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{
  name =  localStorage.getItem('currentUser');
  recipe: any;
  commentForm !: FormGroup;
  comments !: any[];
  recipeId !: any;

  constructor(private authService : AuthService,
    private appService : AppServiceService,
    private route: ActivatedRoute, private fb : FormBuilder) {}

  ngOnInit(){
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.getRecipeDetails(this.recipeId);
    this.commentForm = this.fb.group({
      "comments" : ['']
    })
    this.loadComments();
  }

  loadComments(){
    this.appService.getComment(this.recipeId).subscribe(
      (response)=>{
        console.log(response);
        this.comments = response.result;
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }

  getRecipeDetails(recipeId: any){
    this.appService.getRecipe(recipeId).subscribe(
      (response) => {
        console.log(response.result);
        
        this.recipe = response.result;
      },
      (error) => {
        console.error('Error retrieving recipe details:', error);
      }
    );
  }

  onSubmit(){
    const id = localStorage.getItem('user_id');
    this.appService.addComment(this.commentForm.getRawValue(), id, this.recipeId).subscribe({
      next: (res: any) => {
        console.log(res);
        console.log(this.commentForm);
        window.alert("Comment Added");
        this.commentForm.reset();
        this.loadComments();
      },
      error : (err: any) => {
        console.log(err.error.message);
      }
    })
  }

  logout() {
    this.authService.logout();
  }
}
