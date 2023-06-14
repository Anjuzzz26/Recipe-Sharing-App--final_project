import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerForm !: FormGroup;

  ngOnInit(){
    this.registerForm = new FormGroup({
      "name" : new FormControl(null, Validators.required),
      "email" : new FormControl(null, [Validators.required, Validators.email]),
      "phone" : new FormControl(null, Validators.required),
      "password" : new FormControl(null, Validators.required),
      "confirmPassword" : new FormControl(null, Validators.required)
    })
  }

  onSubmit(postData : { }){
    console.log(this.registerForm);
    
  }
}
