import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { UserService } from './service/user/user.service';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material';
import { LoginComponent } from './component/user/login/login.component';
import { RegisterComponent } from './component/user/register/register.component';
import { SetpasswordComponent } from './component/user/setpassword/setpassword.component';
import { ForgotpasswordComponent } from './component/user/forgotpassword/forgotpassword.component';
import { VerifyComponent } from './component/user/verify/verify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/note/dashboard/dashboard.component';
import { AddnoteComponent } from './component/note/addnote/addnote.component';
import { IconComponent } from './component/note/icon/icon.component';
import { NotesComponent } from './component/note/notes/notes.component';
import { DialogComponent } from './component/note/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SetpasswordComponent,
    ForgotpasswordComponent,
    VerifyComponent,
    DashboardComponent,
    AddnoteComponent,
    IconComponent,
    NotesComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FlexLayoutModule
  ],
  entryComponents: [DialogComponent],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
