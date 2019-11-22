import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from 'src/app/service/data/data.service';
import { log } from 'util';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotePath = 'note';
  token = localStorage.getItem('token');
  notes;

  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService
  ) { }

  ngOnInit() {
    this.getNotes();
    this.data.changeNotes(this.notes);
    this.data.currentNote.subscribe(note => this.notes = note);
  }

  getNotes() {
    this.noteService.getNotes(this.getNotePath, this.token).subscribe(
      result => {
        this.notes = result.data;
      },
      err => { console.log('Failed to fetch notes'); }

    );
  }

  // noteSelect(event) {
  //   this.note = event;
  //   console.log('note selected--->', event);

  // }

  openDialog(note) {
    console.log(note);
    this.dialog.open(DialogComponent,
      {
         width: '600px',
        data: note,
      });

  }


}
