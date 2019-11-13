import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss']
})
export class SetpasswordComponent implements OnInit {


  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
   });

  passwordData = {};
  token;

  constructor(private userService: UserService , private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

  }

  setPassword() {
    console.log(this.passwordData , this.token);
    this.userService.setPasswordNew(this.passwordData, this.token).subscribe(
      response => {
      console.log(response ); }
      );
    }
}
