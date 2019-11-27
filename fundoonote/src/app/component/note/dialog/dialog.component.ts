import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';

import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data/data.service';

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
  notes;








  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService,
    private noteService: NoteService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.noteId = this.data.noteId;
    this.noteColor = this.data.noteColor;
    console.log('data->', this.data.title);
    this.dataService.currentNote.subscribe(note => this.notes = note);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  receiveColor($event, noteId) {
    this.noteColor = $event;

    console.log(this.noteColor, noteId);
    this.updateColor(this.noteColor, noteId);
  }

  updateNote() {
    console.log('this', this.title);
    console.log('description', this.updateData);

    this.updateData = {
      title: this.title.value,
      description: this.description.value
    };
    if (this.updateData.title !== '' || this.updateData.description !== '') {
      this.noteService.updateNote(this.updateData, this.noteId).subscribe(
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
        this.notes = result.data;
        this.dataService.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  updateColor(noteColor, noteId) {
    console.log(noteId);

    this.noteService.updateColor(this.getNotePathColor, noteColor, this.emailIdToken, noteId)
      .subscribe(
        response => {
          this.getNotes();
          this.snackBar.open('Note color updated successfully', 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open('Note color updation failed', 'close')._dismissAfter(2000);
        }
      );

  }


}
