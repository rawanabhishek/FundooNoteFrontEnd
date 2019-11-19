import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  token;
  verifyPath = '/verify';

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

  }

  verify() {
    console.log(this.token);
    this.userService.verifyUser(this.verifyPath, this.token).subscribe(response => {
      this.snackBar.open('your email has been verified', 'close')._dismissAfter(2000);

    },
      error => {
        return this.snackBar.open('email verification failed', 'close')._dismissAfter(2000);
      }
    );
  }

}
