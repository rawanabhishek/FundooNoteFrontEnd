import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  title = new FormControl();

  description = new FormControl();
  updateNotePath = 'note';
  emailIdToken = localStorage.getItem('token');
  noteId: any;
  updateData: any;





  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
              private noteService: NoteService, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.noteId = this.data.noteId;
    console.log('data->' , this.data.title);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateNote() {
    console.log('this', this.title);
    console.log('description', this.updateData);

    this.updateData = {
      title: this.title.value,
      description: this.description.value
    };

    console.log(this.updateData);

    this.noteService.updateNote(this.updateNotePath, this.updateData, this.emailIdToken, this.noteId)
      .subscribe(
        response => {
          this.snackBar.open('Note updated successfully', 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open('Note updation failed', 'close')._dismissAfter(2000);
        }
      );


  }

}
