import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';



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
  noteId: any;
  pin = false;
  archive = false;
  trash = false;
  typeOfNote = '';





  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {
    console.log('im in constructor');
  }

  ngOnInit() {
    this.typeOfNote = this.activatedRoute.snapshot.paramMap.get('type');
    console.log('type', this.typeOfNote);

    this.getNotes();
    this.data.currentNote.subscribe(note => this.notes = note);
  }

  getNotes() {
    if (this.typeOfNote === 'trash') {
      this.trash = true;
    } else if (this.typeOfNote === 'archive') {
      this.archive = true;

    } else if (this.typeOfNote === 'note') {
      this.pin = true;
    }

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
          this.getNotes();
        },
        error => {
          return this.snackBar.open('Note color updation failed', 'close')._dismissAfter(2000);
        }
      );

  }






}






