import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppServiceService } from '../services/app-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signUpForm !: FormGroup;
  errmsg = '';

  constructor(private appService: AppServiceService, private authService: AuthService, 
    private fb:FormBuilder, private route:Router){}


  ngOnInit() {
    this.signUpForm = this.fb.group({
      "email" : [null, [Validators.required, Validators.email]],
      "password" : [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit(){
    this.signUpForm.markAllAsTouched();
    console.log(this.signUpForm.value);
    if (this.signUpForm.invalid) {
      window.alert("Please fill out all required fields");
      return;
    }
    this.appService.login(this.signUpForm.getRawValue()).subscribe ({
      next:(response : any) => {
          console.log(response.message);
          this.authService.login(response.name, response.token, response.id);
          this.route.navigate(['/home']);
      },
      error:(err:any)=>{
        console.log(err);
        this.errmsg = err.error.message;
        console.log(this.errmsg);
      }
    })
  }
}
