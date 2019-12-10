import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';

import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data/data.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  title = new FormControl(this.data.title);

  description = new FormControl(this.data.description);
  updateNotePath = 'note';
  emailIdToken = localStorage.getItem('token');
  noteId: any;
  updateData: any;
  private noteColor: string;
  getNotePathColor = 'note/updatecolor';
  pin = false;
  archive = false;
  trash = false;
  selectable = true;
  removable = true;
  notes;
  labelParam;
  labelId;
  labels = new Array<any>();
  reminder: Date;
  note: any;








  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService,
    private noteService: NoteService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {

    console.log('note dialog inint');

    if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.archive = false;
      this.pin = false;

    }

    if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;
      this.pin = false;

    }


    if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;
      this.pin = false;

    }


    this.note = this.data;
    // this.labels = this.data.labels;
    console.log('data->', this.note);
    this.dataService.currentNote.subscribe(note => this.notes = note);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  receiveMessage($event, note) {
    if ($event === 'archive') {
      this.noteId = note.noteId;
      this.archiveNote();
    } else if ($event === 'unarchive') {
      this.unarchiveNotes();
    } else if ($event === 'deleteforever') {
      this.deleteForever();
    } else if ($event === 'restore') {
      this.restoreNote();
    } else if ($event === 'pin') {
      this.noteId = note.noteId;
    } else if ($event === 'delete') {
      this.noteId = note.noteId;
      this.deleteNote();
    } else if (typeof $event === 'string') {
      this.noteColor = $event;
      this.updateColor(this.noteColor);
    } else if (typeof $event === 'object') {
      if ($event.labelId) {
        this.noteId = note.noteId;
        this.labelId = $event.labelId;
        console.log('notes label ', note.labels);
        console.log('label=>=> ', $event);
        console.log('labelId', this.labelId);
        if (this.note.labels.some((i) => i.labelId === this.labelId)) {
          console.log('remove=> ', this.labelId);
          this.removeLabel($event);
        } else {

          console.log('add=> ', this.labelId);
          this.addLabel($event);
        }
      } else {
        this.reminder = $event;
        this.noteId = note.noteId;
        this.addReminder(this.reminder);

      }
    }
  }



  updateNote() {
    console.log('this', this.title);
    console.log('description', this.updateData);

    this.updateData = {
      title: this.title.value,
      description: this.description.value
    };
    if (this.updateData.title !== '' || this.updateData.description !== '') {
      this.noteService.updateNote(this.updateData, this.note.noteId).subscribe(
        response => {
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
          this.getNotes();
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );

    }


  }

  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        if (this.router.url.includes(this.labelParam)) {
          console.log('update color in labels', this.labelParam);
          this.getNotesByLabel(this.labelParam);
        } else if (this.router.url.includes('reminder')) {
          this.getNotesByReminder();
        } else {
          this.notes = result.data;
          this.dataService.changeNotes(this.notes);
        }
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  getNotesByReminder() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data.filter(item => item.reminder);
        this.dataService.changeNotes(this.notes);


      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }

    );
  }

  getNotesByLabel(labelId) {
    this.noteService.getNoteByLabel(labelId).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  updateColor(noteColor) {


    this.noteService.updateColor(this.getNotePathColor, noteColor, this.emailIdToken, this.note.noteId)
      .subscribe(
        response => {
          this.note.noteColor = noteColor;
          this.getNotes();
          this.snackBar.open('Note color updated successfully', 'close')._dismissAfter(2000);
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
          this.note.reminder = null;
          this.getNotes();
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );
  }


  removeLabel($event) {
    this.noteService.removeLabel(this.note.noteId, $event.labelId)
      .subscribe(
        response => {
          const index = this.note.labels.indexOf($event);
          this.note.labels.splice(index, 1);
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
          this.getNotes();
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );

  }


  archiveNote() {
    this.noteService.archiveNotes(this.note.noteId).subscribe(
      response => {
        this.dialogRef.close();
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
        this.getNotes();
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  deleteNote() {
    this.noteService.trashNote(this.note.noteId).subscribe(
      response => {
        this.dialogRef.close();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        this.getNotes();
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }


  addReminder(reminder) {
    console.log(reminder);
    const date: string = this.datePipe.transform(reminder, 'dd MMMM yyyy hh:mm:ss UTC');

    this.noteService.addReminder(date, this.note.noteId).subscribe(
      response => {
        this.note.reminder = reminder;
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => { this.snackBar.open(error.error.message, 'close')._dismissAfter(2000); });
  }

  addLabel(label) {
    this.noteService.addLabel(this.noteId, label.labelId).subscribe(
      response => {
        this.note.labels.push(label);
        this.getNotes();

        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => { this.snackBar.open(error.error.message, 'close')._dismissAfter(2000); });
  }

  deleteForever() {
    this.noteService.deleteNote(this.note.noteId).subscribe(
      response => {
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  restoreNote() {
    this.noteService.untrash(this.note.noteId).subscribe(
      response => {
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }


  unarchiveNotes() {
    this.noteService.archiveNotes(this.note.noteId).subscribe(
      response => {
        this.dialogRef.close();
        this.getNotes();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }




}
