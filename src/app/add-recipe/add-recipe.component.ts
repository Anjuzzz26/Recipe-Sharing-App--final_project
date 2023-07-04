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
  // formData = new FormData();
  // file !: File;
  name =  localStorage.getItem('currentUser');

  constructor(private appService : AppServiceService, private route : Router, private fb : FormBuilder) {}

  ngOnInit() {
    this.recipeForm = this.fb.group({
      "recipeName" : [, [Validators.required]],
      "ingredients" : [, [Validators.required]],
      "description" : [, [Validators.required]]
    })
  }

  // onFileSelected(event: any) {
  //   this.file = event.target.files[0];
  //   this.uploadFile(this.file);
  // }
  
  // uploadFile(file: File){
  //    this.formData.append('file', file);
  // }
   
  onSubmit() {
    this.recipeForm.markAllAsTouched();
    console.log(this.recipeForm.value);
    if (this.recipeForm.invalid) {
      window.alert("Please fill out all required fields");
      return;
    }
    if(window.confirm("Are you sure you want to submit your updated recipe?")) {
      console.log(localStorage.getItem('user_id'));
      const id = localStorage.getItem('user_id');
      this.appService.createRecipe(this.recipeForm.getRawValue(), id).subscribe({
        next: (res: any) => {
            console.log(res);
            console.log(this.recipeForm);
            this.route.navigate(['/home']);
            window.alert("Your Recipe Added");
        },
        error: (err: any) => {
          console.log(err);
          console.log(err.error.message);      
        }
      })
    }
  }
}
