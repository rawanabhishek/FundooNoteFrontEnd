import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data/data.service';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  note;
  collabOwnerProfilePic;
  collaboratorEmailId = new FormControl();
  email;
  collab;
  pin = false;
  archive = false;
  trash = false;
  notes;
  labelIdParam;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.note = this.data;
    console.log('note Data collaborator', this.note);
    this.getCollaOwnerProfilePic();
    this.getAllCollabProfilePic();




    // this.labels = this.data.labels;
    console.log('data->', this.note);
    //  this.dataService.currentNote.subscribe(note => this.notes = note);

  }

  getCollaOwnerProfilePic() {
    console.log('owner picture', this.note.noteId, this.note.emailId);

    this.noteService.getCollabOwnerProfilePic(this.note.noteId, this.note.emailId).subscribe(
      response => {

        this.collabOwnerProfilePic = response.data;

      },
      error => {

        console.log(error.error);

      }
    );



  }

  getAllCollabProfilePic() {
    this.note.collaborators.forEach(element => {
      this.noteService.getCollabOwnerProfilePic(this.note.noteId, element.email).subscribe(

        response => {
          console.log('in collab profile pic response');
          element.profilePic = response.data;
        },
        error => {
          console.log(error.error);
        }
      );

    });
  }

  // getCollabProfilePic(email): any {
  //   let collabImage;


  //   return collabImage;

  // }


  addCollaborator() {
    console.log('add collab', this.collaboratorEmailId.value, this.note.noteId);
    this.email = this.collaboratorEmailId.value;
    console.log('collab email', this.email);
    this.noteService.addCollaborator(this.collaboratorEmailId.value, this.note.noteId).subscribe(
      response => {
        this.collab = response.data.collaborators.find(j => j.email === this.email);
        this.note.collaborators.push(this.collab);
        this.collaboratorEmailId.reset();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);

      },
      error => {
        return this.snackBar.open(error, 'close')._dismissAfter(2000);
      }
    );
  }

  removeCollaborator(collaborator) {
    this.noteService.removeCollaborator(collaborator.email, this.note.noteId).subscribe(
      response => {

        const index = this.note.labels.indexOf(collaborator);
        this.note.collaborators.splice(index, 1);
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);


      },
      error => {
        return this.snackBar.open(error, 'close')._dismissAfter(2000);
      }
    );
  }




}
