import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  token;

  constructor(private userService: UserService , private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

  }

  verify() {
    console.log( this.token);
    this.userService.verifyUser( this.token).subscribe(response => {
      console.log(response ); }
      );
    }

}
