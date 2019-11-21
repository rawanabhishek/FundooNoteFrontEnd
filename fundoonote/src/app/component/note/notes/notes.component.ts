import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotePath = 'note';
  token = localStorage.getItem('token');
  notes;
  note;

  constructor(private router: Router, private noteService: NoteService, private dialog: MatDialog) { }

  ngOnInit() {


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
    this.dialog.open(DialogComponent,
      {
        panelClass: 'myapp-no-padding-dialog', width: '600px',
        data: note,
      });

  }


}
