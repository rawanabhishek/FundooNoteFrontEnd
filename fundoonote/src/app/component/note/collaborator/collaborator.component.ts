import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  note;
  collabOwnerProfilePic;
  collaboratorEmailId = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private noteService: NoteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.note = this.data;
    console.log('note Data collaborator', this.note);
    this.getCollaOwnerProfilePic();

  }

  getCollaOwnerProfilePic() {
    console.log('owner picture', this.note.noteId, this.note.emailId);

    this.noteService.getCollabOwnerProfilePic(this.note.noteId, this.note.emailId).subscribe(
      response => {

        console.log('in collab response');
        this.collabOwnerProfilePic = response.data;

      },
      error => {

        console.log(error.error);

      }
    );


  }


  addCollaborator() {
    console.log('add collab', this.collaboratorEmailId.value, this.note.noteId);

    this.noteService.addCollaborator(this.collaboratorEmailId.value, this.note.noteId).subscribe(
      response => {
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);

      },
      error => {
        return this.snackBar.open(error, 'close')._dismissAfter(2000);
      }
    );
  }

}
