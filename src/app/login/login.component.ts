import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
// import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signUpForm !: FormGroup;
  errmsg = '';

  constructor(private appService: AppServiceService, 
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
        if(response.message=="Login Successfull"){
          console.log(response.message);
          localStorage.setItem('currentUser',response.results.rows[0].name);
          this.route.navigate(['/home'])
        }
        else{
          this.errmsg = response.message;
          console.log(this.errmsg);
          
          
        }
      },
      error:(err:any)=>{
        console.log(err,'gfdfgd');
      }
    })
  }
}
