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


  constructor(
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private data: DataService
  ) { }

  ngOnInit() {


  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }

  createNote() {

    this.noteData = {
      title: this.title.value,
      description: this.description.value
    };

    this.noteService.createNote(this.createNotePath, this.noteData, this.emailIdToken)
      .subscribe(
        response => {
          this.snackBar.open('Note created successfully', 'close')._dismissAfter(2000);
          this.getNotes();
        },
        error => {
          return this.snackBar.open('Note creation failed', 'close')._dismissAfter(2000);
        }
      );
  }
  getNotes() {
    this.noteService.getNotes(this.createNotePath, this.emailIdToken).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      err => { console.log('Failed to fetch notes'); }

    );
  }




}


