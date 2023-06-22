import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../services/app-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {
  recipeForm !: FormGroup;
  name =  localStorage.getItem('currentUser');

  constructor(private appService : AppServiceService, private route : Router, private fb : FormBuilder) {}

  ngOnInit() {
    this.recipeForm = this.fb.group({
      "recipeName" : [, [Validators.required]],
      "ingredients" : [, [Validators.required]],
      "description" : [, [Validators.required]],
      "image" : []
    })
  }
   
  onSubmit() {
    // this.recipeForm.markAllAsTouched();
    // console.log(this.recipeForm);
    // if(this.recipeForm.invalid){
    //   window.alert("Please fill put all required fields");
    //   return;
    // }
    if(window.confirm("Are you sure you want to submit the form?")) {
      console.log(localStorage.getItem('user_id'));
      const id = localStorage.getItem('user_id');
      this.appService.createRecipe(this.recipeForm.getRawValue(), id).subscribe({
        next: (res: any) => {
            console.log(res);
            console.log(this.recipeForm);
            this.route.navigate(['/home']);
            window.alert("Recipe Added Succesfully");
        },
        error: (err: any) => {
          console.log(err);
          console.log(err.error.message);      
        }
      })
    }
  }
}
