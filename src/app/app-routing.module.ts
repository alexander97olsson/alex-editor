import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './user/log-in/log-in.component';
import { RegisterComponent } from './user/register/register.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'editor', component: EditorComponent},
  {
    path: 'register', component: UserComponent,
    children: [{path: '', component: RegisterComponent}]
  },
  {
    path: 'login', component: UserComponent,
    children: [{path: '', component: LogInComponent}]
  },
  {path: '', redirectTo:'login', pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
