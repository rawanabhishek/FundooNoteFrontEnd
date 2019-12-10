import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReversePipe } from 'src/app/service/pipe/ReversePipe.pipe';





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
  noteList;
  screenType;
  profilePicCollab: string;
  labelParam;

  labels = new Array<any>();
  @Input() view: any;






  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private reversePipe: ReversePipe
  ) {
    console.log('im in constructor');
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(response => {
      // this.typeOfNote = this.activatedRoute.snapshot.paramMap.get('type');
      // console.log('typeOf note', this.typeOfNote);
      // this.data.currentNote.subscribe(note => this.notes = note);
      // this.data.changeNotes(this.notes);

      if (this.router.url.includes('/trash')) {
        this.trash = true;
        this.archive = false;
        this.pin = false;
        this.getNotes();

      }
      if (this.router.url.includes('/archive')) {
        this.trash = false;
        this.archive = true;
        this.pin = false;
        this.getNotes();

      }
      if (this.router.url.includes('/note')) {
        this.trash = false;
        this.archive = false;
        this.pin = false;
        this.getNotes();

      }

      if (this.router.url.includes('/reminder')) {
        this.trash = false;
        this.archive = false;
        this.pin = false;
        this.getNotesByReminder();

      }

      this.labelParam = this.activatedRoute.snapshot.paramMap.get('type');
      console.log('activated param value', this.labelParam);

      this.data.currentNote.subscribe(note => this.notes = note);

    });


    // if (this.router.url.includes('/trash')) {
    //   this.trash = true;
    //   this.archive = false;
    //   this.pin = false;
    //   this.getNotes();

    // }
    // if (this.router.url.includes('/archive')) {
    //   this.trash = false;
    //   this.archive = true;
    //   this.pin = false;
    //   this.getNotes();

    // }
    // if (this.router.url.includes('/note')) {
    //   this.trash = false;
    //   this.archive = false;
    //   this.pin = false;
    //   this.getNotes();

    // }

    // if (this.router.url.includes('/reminder')) {
    //   this.trash = false;
    //   this.archive = false;
    //   this.pin = false;
    //   this.getNotesByReminder();

    // }
    // if (this.router.url.includes('/dashboard')) {
    //   this.labelParam = this.activatedRoute.snapshot.paramMap.get('type');
    // }



    // this.data.currentNote.subscribe(note => this.notes = note);
    // // this.data.changeNotes(this.notes);




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
          this.data.changeNotes(this.notes);
        }
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  getNotesByReminder() {
    {
      this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
        result => {
          this.notes = result.data.filter(item => item.reminder);
          this.data.changeNotes(this.notes);
          console.log('list of notes', this.notes);


        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }

      );
    }
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
        data: note,
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


  getProfilePicCollab() {
    this.noteService.getProfilePic().subscribe(
      response => {

        this.profilePicCollab = response.data;


      },
      error => {
        console.log('Operation failed');

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


}













