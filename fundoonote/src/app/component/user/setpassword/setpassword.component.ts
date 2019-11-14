import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss']
})
export class SetpasswordComponent implements OnInit {



  password = new FormControl('', [Validators.required, Validators.minLength(3)]);
  confirmPassword = new FormControl('', [Validators.required, Validators.minLength(3)]);
  token: any;
  data: any;



  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

  }

  getErrorPassword() {
    return this.password.hasError('required') ? 'password required' :
      this.password.hasError('minlength') ? 'minimum 3 length required ' :
        '';
  }

  setPassword() {

    this.data = {
      password: this.password.value,
      confirmPassword: this.confirmPassword.value
    };

   

    console.log(this.data, this.token);
    this.userService.setPasswordNew(this.data, this.token).subscribe(
      response => {
        this.snackBar.open('your password has been set successfully', 'close')._dismissAfter(2000);

      },
      error => {
        return this.snackBar.open('setting password failed', 'close')._dismissAfter(2000);
      });
  }
}
