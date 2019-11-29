import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar } from '@angular/material';

import { DataService } from 'src/app/service/data/data.service';






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

  @Input() noteId: any;
  pin = false;
  archive = false;
  trash = false;
  showAddLabel = false;

  reminder: string;
  labels: any;





  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private data: DataService

  ) {

  }

  ngOnInit() {

  this.getLabels();
    // this.data.currentNote.subscribe(note => this.notes = note);
  }

  // getNotes() {
  //   this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
  //     result => {
  //       this.notes = result.data;
  //       this.data.changeNotes(this.notes);
  //     },
  //     error => {
  //       this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
  //     }
  //   );
  // }

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

  showAddLabels() {
    this.showAddLabel = this.showAddLabel ? false : true;
  }


  onChange(data) {
    console.log('data is => ', data);

    this.messageEvent.emit(data);

  }

  onEvent(event) {
    event.stopPropagation();
  }






}


