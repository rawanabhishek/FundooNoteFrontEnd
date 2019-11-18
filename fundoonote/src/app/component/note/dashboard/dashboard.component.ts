import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from 'src/app/service/note/note.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  token = localStorage.getItem('token');
  email = localStorage.getItem('email');

  showContent = true;
  showClear = true;
  labels;

  constructor(private router: Router, private noteService: NoteService) { }

  ngOnInit() {
    if (this.token == null) {
      this.router.navigate(['/login']);
    }

    this.noteService.getLabels(this.token).subscribe(
      result => {
        this.labels = result.data;
      },
      err => { console.log('failed to load labels') }

    );
  }






  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);

  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }

  clear() {
    this.showClear = this.showClear ? false : true;

  }

}
