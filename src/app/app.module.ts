import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { CommentComponent } from './comment/comment.component';
import { RatingComponent } from './rating/rating.component';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { RecipieListComponent } from './recipie-list/recipie-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthguardService } from './services/authguard.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';


const appRoutes : Routes = [
    { path : '', component : LoginComponent },
    { path : 'login', component : LoginComponent },
    { path : 'register', component : RegisterComponent },
    { path : 'addrecipe', component : AddRecipeComponent, canActivate : [AuthguardService] },
    { path : 'home', component : HomeComponent, canActivate : [AuthguardService]},
    { path : 'recipedetail/:id', component : RecipeDetailComponent, canActivate : [AuthguardService]}
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    AddRecipeComponent,
    CommentComponent,
    RatingComponent,
    SearchComponent,
    HomeComponent,
    RecipieListComponent,
    RecipeDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
