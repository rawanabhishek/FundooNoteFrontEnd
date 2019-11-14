import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  contact = new FormControl('', [Validators.required, Validators.pattern('^[6-9]\d{9}$')]);
  password = new FormControl('', [Validators.required]);
  confirmpassword = new FormControl('', [Validators.required]);

  data: any;


  ngOnInit() {
  }

  getErrorFirstName() {
    return this.firstName.hasError('required') ? 'first name required' :
      '';

  }

  getErrorLastName() {
    return this.firstName.hasError('required') ? 'last name required' :
      '';

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

  getErrorContact() {
    return this.contact.hasError('required') ? 'contact required' :
      this.contact.hasError('pattern') ? 'invalid contact' :
        '';
  }

  constructor(private routes: Router, private userService: UserService, private snackBar: MatSnackBar) { }
  loginRedirect() {
    this.routes.navigate(['/login']);
  }


  registerUser() {
    this.data = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      contact: this.contact.value,
      password: this.password.value
    };


    this.userService.registerUser(this.data)
      .subscribe(
        response => {
          this.snackBar.open('registration successful', 'close')._dismissAfter(2000);

        },
        error => {
          return this.snackBar.open('registration failed', 'close')._dismissAfter(2000);
        }
      );
  }


}
