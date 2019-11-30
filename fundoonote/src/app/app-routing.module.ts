import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './component/user/register/register.component';
import { ForgotpasswordComponent } from './component/user/forgotpassword/forgotpassword.component';
import { SetpasswordComponent } from './component/user/setpassword/setpassword.component';
import { VerifyComponent } from './component/user/verify/verify.component';
import { DashboardComponent } from './component/note/dashboard/dashboard.component';

import { NotesComponent } from './component/note/notes/notes.component';
import { LoginComponent } from './component/user/login/login.component';
import { AddnoteComponent } from './component/note/addnote/addnote.component';
import { AuthGuard } from './auth.guard';




const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot', component: ForgotpasswordComponent },
  { path: 'setpassword', component: SetpasswordComponent },
  { path: 'verify', component: VerifyComponent }

  ,
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: ':type', component: NotesComponent },

      { path: 'addnote', component: AddnoteComponent }



    ]

  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
