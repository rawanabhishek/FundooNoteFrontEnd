import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {


  email = new FormControl('', [Validators.required, Validators.email]);
  forgotPasswordPath = '/forgotpassword';

  data: any;
  constructor(private routes: Router, private userService: UserService, private snackBar: MatSnackBar) { }


  ngOnInit() {
  }


  getErrorEmail() {
    return this.email.hasError('required') ? 'email required' :
      this.email.hasError('email') ? 'email format worng ' :
        '';

  }

  loginRedirect() {
    this.routes.navigate(['/login']);
  }

  forgotPasswordUser() {


    console.log(this.email);

    this.data = this.email.value;

    this.userService.forgotPassword(this.forgotPasswordPath, this.data).subscribe(response => {
      this.snackBar.open('Email send success', 'close')._dismissAfter(2000);

    },
      error => {
        return this.snackBar.open('Email send failed', 'close')._dismissAfter(2000);
      }
    );

  }

}
