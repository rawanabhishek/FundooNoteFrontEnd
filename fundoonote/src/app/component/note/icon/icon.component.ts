import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar, MatDialog } from '@angular/material';

import { DataService } from 'src/app/service/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CollaboratorComponent } from '../collaborator/collaborator.component';







@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  token = localStorage.getItem('token');
  notes;
  getNotePathArchive = 'note/archive';

  getNotePathTrash = 'note';
  @Output() messageEvent = new EventEmitter<string>();

  emailIdToken = localStorage.getItem('token');

  @Input() noteData: any;
  @Input() noteId: any;
  pin = false;
  archive = false;
  trash = false;
  showAddLabel = false;
  unarchive = false;
  datetime;
  reminder: string;
  labels: any;

  // @Input() screens = '';

  typeOfNote = '';





  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private data: DataService,
    private dialog: MatDialog,
    private router: Router,

  ) {

  }

  ngOnInit() {




    if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.unarchive = true;
    } else if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.unarchive = false;
    } else {
      this.trash = false;
      this.unarchive = false;
    }

    this.getLabels();
    this.data.currentLabel.subscribe(label => this.labels = label);
    this.data.currentNote.subscribe(note => this.notes = note);
  }




  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }





  getLabels() {
    this.noteService.getLabels().subscribe(
      result => {
        this.labels = result.data;
        this.data.changeLabel(this.labels);
      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  showAddLabels($event) {
    $event.stopPropagation();
    this.showAddLabel = this.showAddLabel ? false : true;
  }


  onChange(data) {
    console.log('data is => ', data);

    this.messageEvent.emit(data);


  }


  openCollaboratorDialog() {
    console.log('open collab dialog', this.noteData);

    this.dialog.open(CollaboratorComponent,
      {
        panelClass: 'dialog-collaborator-padding',
        width: '600px',
        data: this.noteData
      });
    this.dialog.afterAllClosed.subscribe(
      result => {
        this.getNotes();
      }
    );

  }








}


