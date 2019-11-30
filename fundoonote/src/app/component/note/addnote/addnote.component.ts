import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';


@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss']
})
export class AddnoteComponent implements OnInit {
  showContent = true;

  title = new FormControl();
  description = new FormControl();
  emailIdToken = localStorage.getItem('token');

  noteData: any;
  createNotePath = 'note';
  private notes;
  private noteColor: string;
  pin = false;
  archive = false;
  trash = false;
  reminder: Date;
  labels = new Array<any>();
  selectable = true;
  removable = true;
  labelId;


  constructor(
    private snackBar: MatSnackBar,
    private noteService: NoteService,
    private data: DataService
  ) { }

  ngOnInit() {

  }

  receiveMessage($event) {

    if ($event === 'archive') {
      this.archive = true;
    } else if ($event === 'pin') {
      this.pin = true;
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
    this.pin = this.pin ? false : true;
  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }


  createNote() {

    this.noteData = {
      title: this.title.value,
      description: this.description.value,
      noteColor: this.noteColor,
      pin: this.pin,
      reminder: this.reminder,
      archive: this.archive,
      labels: this.labels



    };

    if (this.noteData.title != null || this.noteData.description != null) {
      this.addNote();

      this.title.reset();
      this.description.reset();
      this.archive = false;
      this.noteColor = '#ffffff';
    }
  }

  addNote() {
    this.noteService.createNote(this.noteData).subscribe(
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
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );

  }


  removeReminder() {
    this.reminder = null;

  }


  removeLabels(index): void {
    this.labels.splice(index, 1);

  }







}


