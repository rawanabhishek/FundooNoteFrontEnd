import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';
import { ReversePipe } from 'src/app/service/pipe/ReversePipe.pipe';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit {
  showContent = true;
  pinShow = true;
  showCollab = true;
  title = new FormControl();
  description = new FormControl();
  collaboratorEmailId = new FormControl();

  emailIdToken = localStorage.getItem('token');
  emailId;

  createNotePath = 'note';
  notes;
  noteColor: string;
  pin = false;
  archive = false;
  trash = false;
  reminder: Date;
  labels = new Array<any>();
  selectable = true;
  removable = true;
  collaborators = new Array<any>();
  collaborator;
  labelId;
  ownerProfilePic;
  noteInfo;
  labelIdParam;




  constructor(
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private data: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {


    if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.archive = false;


    } else if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;
    } else if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;

    } else if (this.router.url.includes('/reminder')) {
      this.trash = false;
      this.archive = false;

    } else {
      this.trash = false;
      this.archive = false;

      this.labelIdParam = this.activatedRoute.snapshot.firstChild.paramMap.get('type');

      console.log('labelParam note', this.activatedRoute.snapshot.firstChild.paramMap.get('type'));
    }



    this.getOwnerProfilePic();
    this.emailId = localStorage.getItem('email');
  }

  receiveMessage($event) {

    if ($event === 'archive') {
      this.archive = true;
    } else if ($event === 'pin') {
      this.pin = true;
    } else if ($event === 'collaborator') {
      this.showCollabContent();
    } else if (typeof $event === 'string') {
      this.noteColor = $event;
    } else if (typeof $event === 'object') {

      if ($event.labelId) {
        console.log('label=> ', $event.labelId);
        if (!(this.labels.find((i) => i === $event)) || this.labels.length < 0) {
          this.labels.push($event);
          console.log('label=> ', this.labels);
        } else {
          for (const label of this.labels) {
            if (label.labelId === $event.labelId) {
              this.labels.splice(this.labels.indexOf(label), 1);
              break;
            }
          }

        }


      } else {
        this.reminder = $event;



      }
    }
  }

  pinNote() {
    this.pinShow = this.pinShow ? false : true;
  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }

  showCollabContent() {
    this.showCollab = this.showCollab ? false : true;
  }


  createNote() {

    this.noteInfo = {
      title: this.title.value,
      description: this.description.value,
      noteColor: this.noteColor,
      pin: this.pin,
      reminder: this.reminder,
      archive: this.archive,
      labels: this.labels,
      collaborators: this.collaborators



    };

    if (this.noteInfo.title != null || this.noteInfo.description != null) {
      this.addNote();
      console.log('title', this.noteInfo.title);

      this.title.reset();
      this.description.reset();
      this.archive = false;
      this.noteColor = '#ffffff';
    }
  }

  addNote() {
    this.noteService.createNote(this.noteInfo).subscribe(
      response => {
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        this.getNotes();
      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  getNotes() {
    this.noteService.getNotes(this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.notes.forEach(element => {
          element.collaborators.forEach(element2 => {
            this.noteService.getCollabOwnerProfilePic(element.noteId, element2.email).subscribe(

              response => {
                console.log('in collab profile pic response');
                element2.profilePic = response.data;
              },
              error => {
                console.log(error.error);
              }
            );
          });


        });
        if (this.router.url.includes(this.labelIdParam)) {
          console.log('update color in labels', this.labelIdParam);
          // tslint:disable-next-line: triple-equals
          this.notes = this.notes.filter(i => i.labels.find(j => j.labelId == this.labelIdParam));
        } else if (this.router.url.includes('reminder')) {
          this.notes = this.notes.filter(i => i.reminder);
        }
        this.data.changeNotes(this.notes);

      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }


  removeReminder() {
    this.reminder = null;

  }


  removeLabels(index): void {
    this.labels.splice(index, 1);

  }


  getOwnerProfilePic() {
    this.noteService.getProfilePic().subscribe(
      response => {

        this.ownerProfilePic = response.data;


      },
      error => {
        console.log('Operation failed');

      }
    );

  }


  addCollaborator() {
    console.log('collab email value', this.collaboratorEmailId.value);

    this.noteService.getcollaborator(this.collaboratorEmailId.value).subscribe(
      response => {
        this.collaborator = response.data;
        this.collaborators.push(this.collaborator);
        this.noteService.getCollaboratorProfilePic(this.collaborator.email).subscribe(result => {
          this.collaborator.profilePic = result.data;
        }, error => {
          return this.snackBar.open(error, 'close')._dismissAfter(2000);
        }
        );
        this.collaboratorEmailId.reset();
        this.snackBar.open(response.message, 'close')._dismissAfter(2000);

      },
      error => {
        return this.snackBar.open(error, 'close')._dismissAfter(2000);
      }
    );
  }


  removeCollaborator(index) {
    this.collaborators.splice(index, 1);

  }







}


