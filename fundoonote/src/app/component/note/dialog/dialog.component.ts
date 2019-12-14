import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from '@angular/material';
import { NoteService } from 'src/app/service/note/note.service';

import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/service/data/data.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { $ } from 'protractor';
import { CollaboratorComponent } from '../collaborator/collaborator.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  title = new FormControl(this.data.note.title);

  description = new FormControl(this.data.note.description);
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
  labelIdParam;
  pinShow;
  notesPin;








  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: DataService,
    private noteService: NoteService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    console.log('note dialog inint');

    if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.archive = false;
      this.pin = false;

    } else if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;
      this.pin = false;

    } else if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;
      this.pin = false;

    } else {
      this.trash = false;
      this.archive = false;
      this.pin = false;
      this.labelIdParam = this.activatedRoute.snapshot.firstChild.paramMap.get('type');
    }


    this.note = this.data.note;
    this.noteId = this.data.note.noteId;
    this.labelIdParam = this.data.labelParam;
    this.pinShow = this.note.pin;
    console.log('labelId param dialogue', this.labelIdParam);

    // this.labels = this.data.labels;
    console.log('data->', this.note);
    this.dataService.currentNote.subscribe(note => this.notes = note);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  receiveMessage($event) {
    if ($event === 'archive') {
      this.archiveNote();
    } else if ($event === 'unarchive') {
      this.unarchiveNotes();
    } else if ($event === 'deleteforever') {
      this.deleteForever();
    } else if ($event === 'restore') {
      this.restoreNote();
    } else if ($event === 'pin') {
    } else if ($event === 'delete') {
      this.deleteNote();
    } else if ($event === 'collaborator') {
      this.openCollaboratorDialog();
   } else if (typeof $event === 'string') {
      this.noteColor = $event;
      this.updateColor(this.noteColor);
    } else if (typeof $event === 'object') {
      if ($event.labelId) {
        this.labelId = $event.labelId;
        console.log('notes label ', this.noteId);
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


  openCollaboratorDialog() {
    this.dialog.open(CollaboratorComponent,
      {
        panelClass: 'dialog-collaborator-padding',
        width: '600px',
        data: this.note
      });
    this.dialog.afterAllClosed.subscribe(
      result => {
        this.getNotes();
      }
    );

  }


  pinUnpin() {
   this.pinShow = this.pinShow ? false : true;
   this.noteService.pinNote(this.note.noteId).subscribe(
    response => {
      this.getNotes();
      this.getNotesPin();
      this.snackBar.open(response.message, 'close')._dismissAfter(2000);
    },
    error => {
      return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
    }
  );
  }

  getNotesPin() {
    console.log('from pin', this.pin, this.archive, this.trash);

    this.noteService.getNotes(true, false, false).subscribe(
      result => {

        this.notesPin = result.data;
        this.dataService.chnagePinNote(this.notesPin);


      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        if (this.router.url.includes(this.labelIdParam)) {
          console.log('update color in labels', this.labelIdParam);
          this.getNotesByLabel(this.labelIdParam);
        } else if (this.router.url.includes('reminder')) {
          console.log('update color in reminder');
          this.getNotesByReminder();
        } else {
          console.log('update color in note');
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
        console.log('label notes in dialog', this.notes);
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
        this.dataService.changeNotes(this.notes);

      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      });

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
