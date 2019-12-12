import { Component, OnInit, Input } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  getNotePath = 'note';
  token = localStorage.getItem('token');
  notes;

  getNotePathTrash = 'note/trash';

 getNotePathColor = 'note/updatecolor';
  pin = true;
  archive = false;
  trash = false;
  noteId;
  labels = new Array<any>();
  labelId;
  reminder;
  labelIdParam;
  selectable = true;
  removable = true;
  noteColor;

  constructor(
    private noteService: NoteService,
    private data: DataService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    console.log('in pin component constructor');

  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(response => {
      if (this.router.url.includes('/note')) {
        this.getNotes();
      }

    });

    this.data.currentPinNote.subscribe(note => this.notes = note);
  }

  getNotes() {
    console.log('from pin', this.pin, this.archive, this.trash);

    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {

        this.notes = result.data;
        this.data.chnagePinNote(this.notes);

      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }


  receiveMessage($event, note) {
    if ($event === 'archive') {
      this.noteId = note.noteId;
      this.archiveNote();
    } else if ($event === 'unarchive') {
      this.noteId = note.noteId;
      this.unarchiveNotes();
    } else if ($event === 'deleteforever') {
      this.deleteForever(note.noteId);
    } else if ($event === 'restore') {
      this.restoreNote(note.noteId);
    } else if ($event === 'pin') {
      this.noteId = note.noteId;
    } else if ($event === 'delete') {
      this.noteId = note.noteId;
      this.deleteNote();
    } else if (typeof $event === 'string') {
      this.noteColor = $event;
      this.updateColor(this.noteColor, note.noteId);
    } else if (typeof $event === 'object') {
      if ($event.labelId) {
        this.noteId = note.noteId;
        this.labelId = $event.labelId;
        console.log('note labels', note.labels);
        console.log('label=> ', $event);
        console.log('sdsd', this.labels);
        if (note.labels.some(i => i.labelId === $event.labelId)) {
          console.log('remove=> ', this.labelId);
          this.removeLabel($event, this.noteId);
          // const index = note.labels.indexOf($event);
          // note.labels.splice(index, 1);
        } else {

          console.log('add=> ', this.labelId);

          this.addLabel(this.labelId);

        }

      } else {
        this.reminder = $event;
        this.noteId = note.noteId;
        this.addReminder(this.reminder, this.noteId);

      }
    }
  }




  openDialog(note) {
    console.log(note);
    this.dialog.open(DialogComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        width: '600px',
        data: { note, labelParam: this.labelIdParam }

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

  removeReminder(note) {

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

  removeLabel(label, noteId) {
    this.noteService.removeLabel(noteId, label.labelId)
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
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }


  addReminder(reminder, noteId) {
    console.log('reminder =>', reminder);
    const date: string = this.datePipe.transform(reminder, 'dd MMMM yyyy hh:mm:ss UTC');

    this.noteService.addReminder(date, noteId).subscribe(
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


  deleteForever(noteId) {
    this.noteService.deleteNote(noteId).subscribe(
      response => {
        console.log('deleteforever', this.pin, this.archive, this.trash);
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  restoreNote(noteId) {
    this.noteService.untrash(noteId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }







  unarchiveNotes() {
    this.noteService.archiveNotes(this.noteId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );

  }

  pinNote(noteId) {
    this.noteService.pinNote(noteId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }



}
