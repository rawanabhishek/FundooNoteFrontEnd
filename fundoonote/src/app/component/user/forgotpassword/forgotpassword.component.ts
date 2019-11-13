import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
   });

  email: any;
  constructor(private routes: Router , private userService: UserService) { }
  loginRedirect() {
    this.routes.navigate(['/login']);
  }


  ngOnInit() {
  }

  forgotPasswordUser() {

    this.userService.forgotPassword(this.email).subscribe(response => {
          console.log(response );
    }
    );

  }

}
