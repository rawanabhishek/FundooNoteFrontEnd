import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(3)]);
  data: any;
  hide = true;
  loginPath = '/login';
  responseData: any;


  ngOnInit() {
  }

  getErrorEmail() {
    return this.email.hasError('required') ? 'email required' :
      this.email.hasError('email') ? 'email format worng ' :
        '';

  }

  getErrorPassword() {
    return this.password.hasError('required') ? 'password required' :
      this.password.hasError('minlength') ? 'minimum 3 length required ' :
        '';
  }

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }
  registerRedirect() {
    this.router.navigate(['/register']);
  }
  forgotpasswordRedirect() {
    this.router.navigate(['/forgot']);
  }
  loginUser() {
    this.data = {
      email: this.email.value,
      password: this.password.value
    };

    console.log(this.data);
    this.userService.loginUser(this.loginPath, this.data)
      .subscribe(

        response => {

          this.snackBar.open('You have been logged successfully', 'close')._dismissAfter(2000);

          console.log(response);
          localStorage.setItem('token', response.data);
          localStorage.setItem('email', this.email.value);
          this.router.navigate(['/dashboard']);

        },
        error => {
          this.snackBar.open('Wrong credentials', 'close')._dismissAfter(2000);
        }
      );
  }


}
