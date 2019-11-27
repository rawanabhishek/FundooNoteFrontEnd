import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';


@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit {
  showContent = true;

  title = new FormControl();
  description = new FormControl();
  emailIdToken = localStorage.getItem('token');

  noteData: any;
  createNotePath = 'note';
  private notes;
  private noteColor: string;
  pin = false;
  archive = false;
  trash = false;


  constructor(
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private data: DataService
  ) { }

  ngOnInit() {

  }

  receiveColor($event) {
    this.noteColor = $event;
  }

  pinNote() {
    this.pin = this.pin ? false : true;
  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }


  createNote() {

    this.noteData = {
      title: this.title.value,
      description: this.description.value,
      noteColor: this.noteColor,
      pin: this.pin




    };

    if (this.noteData.title != null || this.noteData.description != null) {
      this.addNote();

      this.title.reset();
      this.description.reset();
      this.noteColor = '#ffffff';
    }
  }

  addNote() {
    this.noteService.createNote(this.noteData).subscribe(
      response => {
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        this.getNotes();
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }







}


