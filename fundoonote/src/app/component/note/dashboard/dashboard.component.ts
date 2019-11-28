import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';
import { MatDialog } from '@angular/material';
import { LabeldialogComponent } from '../labeldialog/labeldialog.component';

import { Observable } from 'rxjs';
import { log } from 'util';


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
  toggle = true;
  status = 'Enable';
  typeOfNote = '';

  selectedId: any;

  constructor(
    private router: Router,
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.typeOfNote = this.activatedRoute.snapshot.paramMap.get('type');
    console.log(this.typeOfNote);




    this.data.currentLabel.subscribe(label => this.labels = label);
    this.getLabels();

    this.data.changeLabel(this.labels);
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

  archive() {
    console.log('archive');

    this.router.navigate(['/dashboard/notes/archive']);

  }

  notes() {
    console.log('note click');
    this.router.navigate(['/dashboard/notes/note']);
  }

  trash() {
    console.log('trash click');
    this.router.navigate(['/dashboard/notes/trash']);
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
        width: '22vw'
      });

  }


}
