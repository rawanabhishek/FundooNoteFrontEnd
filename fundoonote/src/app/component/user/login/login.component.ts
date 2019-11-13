import { Component, OnInit } from '@angular/core';
import {  FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


   email = new FormControl('', [Validators.required, Validators.email]);
   password = new FormControl('', [Validators.required, Validators.minLength(3)]);
   data: any;

 ngOnInit() {
    }

    getErrorEmail() {
     return this.email.hasError('required') ? 'email required' :
     this.email.hasError('email') ? 'email format worng ' :
     '';

    }

    getErrorPassword() {
      return this.password.hasError('required') ? 'password required' :
     '';
    }

    constructor(private routes: Router , private userService: UserService) { }
    registerRedirect() {
      this.routes.navigate(['/register']);
    }
    forgotpasswordRedirect() {
      this.routes.navigate(['/forgot']);
    }
    loginUser() {
      this.data = {
        email: this.email.value,
        password: this.password.value
      };

      this.userService.loginUser(this.data)
      .subscribe(
        response => {
          console.log(response );
    }
    );
  }


}
