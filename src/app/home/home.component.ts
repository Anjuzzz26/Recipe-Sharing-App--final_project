import { Component, OnInit } from '@angular/core';
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
  searchForm !: FormGroup;

  constructor(private authService : AuthService, private appService : AppServiceService, 
    private formBuilder: FormBuilder) {}

  ngOnInit(){
    this.searchForm = this.formBuilder.group({
      searchTerm: ['']
    });
    this.loadRecipes();
  }

  loadRecipes(){
    this.appService.getAllRecipes().subscribe(
      (response) => {
        console.log(response);
        this.recipes = response.result;
        console.log(this.recipes);
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }

  searchRecipes(){
    const searchTerm = this.searchForm.value.searchTerm;
    if (searchTerm) {
      this.appService.searchRecipes(searchTerm).subscribe(
        (response) => {
          this.recipes = response;
        },
        (error) => {
          console.error('Error searching recipes:', error);
        }
      );
    } else {
      this.loadRecipes();
    }
  }

  logout() {
    this.authService.logout();
  }
}
