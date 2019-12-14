import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReversePipe } from 'src/app/service/pipe/ReversePipe.pipe';
import { of } from 'rxjs';
import { CollaboratorComponent } from '../collaborator/collaborator.component';





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

  archive = false;
  trash = false;
  typeOfNote = '';
  selectable = true;
  removable = true;
  reminder: Date;
  labelId;
  noteList;
  screenType;
  profilePicCollab: string;
  labelParam: any;
  datetime;
  notesPin;
  showPinNotes = false;
  labels = new Array<any>();
  @Input() view: any;
  @Input() labelIdParam: any;






  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router
  ) {
    console.log('im in notes constructor');
  }

  ngOnInit() {


    this.activatedRoute.url.subscribe(response => {


      if (this.router.url.includes('/trash')) {
        this.trash = true;
        this.archive = false;

        this.showPinNotes = false;


      } else if (this.router.url.includes('/archive')) {
        this.trash = false;
        this.archive = true;

        this.showPinNotes = false;


      } else if (this.router.url.includes('/note')) {
        this.trash = false;
        this.archive = false;

        this.showPinNotes = true;


      } else if (this.router.url.includes('/reminder')) {
        this.trash = false;
        this.archive = false;

        this.showPinNotes = true;



      } else {
        this.trash = false;
        this.archive = false;
        this.showPinNotes = true;

        this.labelIdParam = this.activatedRoute.snapshot.firstChild.paramMap.get('type');

        console.log('labelParam note', this.activatedRoute.snapshot.firstChild.paramMap.get('type'));
      }


      this.getNotes();
      this.data.currentNote.subscribe(note => this.notes = note);



    });



  }


  getNotes() {
    this.noteService.getNotes(this.archive, this.trash).subscribe(
      result => {

        this.notes = result.data;
        this.notes.forEach(element => {
          element.collaborators.forEach(element2 => {
            this.noteService.getCollabOwnerProfilePic(element.noteId, element2.email).subscribe(
              response => {
                element2.profilePic = response.data;
              },
              error => {
                console.log(error.error);
              }
            );
          });
        });


        if (this.router.url.includes(this.labelIdParam)) {
          // tslint:disable-next-line: triple-equals
          this.notes = this.notes.filter(i => i.labels.find(j => j.labelId == this.labelIdParam));
        } else if (this.router.url.includes('reminder')) {
          console.log('add by reminder', this.notes);
          this.notes = this.notes.filter(i => i.reminder);
        }
        this.data.changeNotes(this.notes);

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
    } else if ($event === 'collaborator') {
      this.openCollaboratorDialog(note);
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

  openCollaboratorDialog(note) {
    this.dialog.open(CollaboratorComponent,
      {
        panelClass: 'dialog-collaborator-padding',
        width: '600px',
        data: note
      });
    this.dialog.afterAllClosed.subscribe(
      result => {
        this.getNotes();
      }
    );

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
          console.log('label param value', this.labelParam);
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
        console.log('deleteforever', this.archive, this.trash);
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


  getAllCollabProfilePic(note) {
    note.collaborators.forEach(element => {
      this.noteService.getCollabOwnerProfilePic(note.noteId, element.email).subscribe(

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













