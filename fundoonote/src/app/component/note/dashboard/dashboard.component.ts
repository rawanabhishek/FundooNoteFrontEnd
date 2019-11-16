import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  token = localStorage.getItem('token');

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.token == null) {
      this.router.navigate(['/login']);
    }
  }

  signOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }

}
