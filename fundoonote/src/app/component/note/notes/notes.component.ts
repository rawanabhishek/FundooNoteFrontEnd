import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';



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
  selectable = true;
  removable = true;
  reminder: Date;
  labelId;
  





  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  )

  {
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


  receiveMessage($event, noteId) {
    if ($event === 'archive') {
      this.archive = true;
      this.noteId = noteId;
      this.archiveNote();
    } else if ($event === 'pin') {
      this.pin = true;
      this.noteId = noteId;
    } else if ($event === 'delete') {
      this.trash = true;
      this.noteId = noteId;
      this.deleteNote();
    } else if (typeof $event === 'string') {
      this.noteColor = $event;
      this.updateColor(this.noteColor, noteId);
    } else if (typeof $event === 'object') {
      if ($event.labelId) {
        this.noteId = noteId;
        this.labelId = $event.labelId;
        console.log('labelId=> ', this.labelId);
        this.addLabel(this.labelId);
      } else {
        this.reminder = $event;
        this.noteId = noteId;
        this.addReminder(this.reminder);

      }
    }
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
    console.log('color=>', noteColor);

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

  remove(note) {

    this.noteService.removeReminder(note.noteId)
      .subscribe(
        response => {
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
          this.getNotes();
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );
  }


  archiveNote() {
    this.noteService.archiveNotes(this.noteId).subscribe(
      response => {
        this.archive = false;
        this.getNotes();
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  deleteNote() {
    this.noteService.trashNote(this.noteId).subscribe(
      response => {
        this.trash = false;
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }


  addReminder(reminder) {
    console.log('reminder =>', reminder);
    const date: string = this.datePipe.transform(reminder, 'dd MMMM yyyy hh:mm:ss UTC');

    this.noteService.addReminder(date, this.noteId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => { this.snackBar.open(error.error.message, 'close')._dismissAfter(2000); });
  }


  addLabel(labelId) {
    this.noteService.addLabel(this.noteId, labelId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => { this.snackBar.open(error.error.message, 'close')._dismissAfter(2000); });
  }
}













