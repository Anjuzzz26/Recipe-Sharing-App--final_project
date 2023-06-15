import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerForm !: FormGroup;

  ngOnInit(){
    this.registerForm = this.fb.group({
      "name" : [null, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      "email" : [null, [Validators.required, Validators.email]],
      "phone" : [null, [Validators.required, Validators.maxLength(10)]],
      "password" : [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)]],
      "confirmPassword" : [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)]]
    },
    {
      validator : this.passwordMatchValidator('password', 'confirmPassword')
    }
    )
  }
  passwordMatchValidator(controlName: string, matchingControlName: string): Validators {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  constructor(private appService: AppServiceService, private route: Router, private fb: FormBuilder,) {}

  clsAlphaNoOnly(event: any): void {
    const pattern = /[a-zA-Z\s]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  uponPaste(event: any) {
    event.preventDefault();
    return false;
  }

  classAlphaNoOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onPaste(event: any) {
    event.preventDefault();
    return false;
  }

  onSubmit(){
    this.registerForm.markAllAsTouched();
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      window.alert("Please fill out all required fields");
      return;
    }

    if(window.confirm("Are you sure you want to submit the form?")){
      this.appService.register(this.registerForm.getRawValue()).subscribe({
        next: (res:any) => {
          console.log(res);
          console.log(this.registerForm);
          this.route.navigate(['/login']);
          console.log("Success");
          // this.snackBar.open('Registered Successfully!', 'Close', this.config);
        },
        error:(err:any)=>{
            console.log(err)
            console.log("Failed");
            
            //  this.snackBar.open(err.error.message, 'Close',this.config)
        }
      })
    }
  }
}
