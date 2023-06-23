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

  constructor(private authService : AuthService,
    private appService : AppServiceService,
    private route: ActivatedRoute, private fb : FormBuilder) {}

  ngOnInit(){
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.getRecipeDetails(recipeId);
    this.commentForm = this.fb.group({
      "comments" : ['']
    })

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
    this.appService.addComment(this.commentForm.getRawValue(), id).subscribe({
      next: (res: any) => {
        console.log(res);
        console.log(this.commentForm);
        window.alert("Comment Added")
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
