import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotePath = 'note';
  token = localStorage.getItem('token');
  notes;

  getNotePathTrash = 'note/trash';

  getNotePathColor = 'note/updatecolor';
  private noteColor: string;





  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getNotes();
    this.data.changeNotes(this.notes);
    this.data.currentNote.subscribe(note => this.notes = note);
  }

  getNotes() {
    this.noteService.getNotes(this.getNotePath, this.token).subscribe(
      result => {
        this.notes = result.data;
      },
      err => { console.log('Failed to fetch notes'); }

    );
  }

  // noteSelect(event) {
  //   this.note = event;
  //   console.log('note selected--->', event);

  // }


  receiveColor($event, noteId) {
    this.noteColor = $event;

    console.log(this.noteColor, noteId);
    this.updateColor(this.noteColor, noteId);
  }

  openDialog(note) {
    console.log(note);
    this.dialog.open(DialogComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        width: '600px',
        data: note,
      });

  }




  updateColor(noteColor, noteId) {
    console.log(noteId);

    this.noteService.updateColor(this.getNotePathColor, noteColor, this.token, noteId)
      .subscribe(
        response => {
          this.snackBar.open('Note color updated successfully', 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open('Note color updation failed', 'close')._dismissAfter(2000);
        }
      );

  }






}






