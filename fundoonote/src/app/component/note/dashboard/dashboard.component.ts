import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';
import { MatDialog } from '@angular/material';
import { LabeldialogComponent } from '../labeldialog/labeldialog.component';


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
  showView = true;
  labels;
  getLabelsPath = 'label';
  message: any;

  constructor(
    private router: Router,
    private noteService: NoteService,
    private data: DataService,
    private dialog: MatDialog) { }

  ngOnInit() {


    this.getLabels();
    this.data.changeLabel(this.labels);
    this.data.currentLabel.subscribe(label => this.labels = label);



  }

  getLabels() {
    this.noteService.getLabels(this.getLabelsPath, this.token).subscribe(
      result => {
        this.labels = result.data;
      },
      err => { console.log('failed to load labels'); }

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


  view() {
    this.showView = this.showView ? false : true;
  }


  openDialogLabel() {
    this.dialog.open(LabeldialogComponent,
      {
        width: '300px'
      });

  }

}
