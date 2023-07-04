import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../services/app-service.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent {
  recipeEditForm !: FormGroup;
  name =  localStorage.getItem('currentUser');
  recipeId !: any;
  recipe: any;

  constructor(private authService : AuthService,
    private appService : AppServiceService,
    private activeRoute: ActivatedRoute,
    private route : Router, private fb : FormBuilder) {}

  ngOnInit() {
    this.recipeId = this.activeRoute.snapshot.paramMap.get('id');
    this.recipeEditForm = this.fb.group({
      "recipeName" : [, [Validators.required]],
      "ingredients" : [, [Validators.required]],
      "description" : [, [Validators.required]]
    })
    this.getRecipeDetails(this.recipeId);
  }

  getRecipeDetails(recipeId: any){
    this.appService.getRecipe(recipeId).subscribe(
      (response) => {
        console.log(response.result);
        this.recipe = response.result[0];
        this.populateForm();
      },
      (error) => {
        console.error('Error retrieving recipe details:', error);
      }
    );
  }

  populateForm() {
    this.recipeEditForm.patchValue({
      recipeName: this.recipe.recipe_name,
      ingredients: this.recipe.ingredients,
      description: this.recipe.description,
    });
  }
  
  onSubmit() {
    if (this.recipeEditForm.invalid) {
      window.alert("Please fill out all required fields");
      return;
    }
    if(window.confirm("Are you sure you want to update your recipe?")) {
      this.appService.updateRecipe(this.recipeEditForm.getRawValue(), this.recipeId).subscribe({
        next: (res: any) => {
            console.log(res);
            console.log(this.recipeEditForm);
            this.route.navigate(['/myrecipe']);
            window.alert("Your Recipe Updated");
        },
        error: (err: any) => {
          console.log(err);
          console.log(err.error.message);      
        }
      })
    }
  }

  cancel(){
    this.route.navigate(['/myrecipe']);
  }
}
