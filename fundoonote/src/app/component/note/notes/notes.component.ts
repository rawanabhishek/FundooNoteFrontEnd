import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  getNotePath = 'note';
  token = localStorage.getItem('token');
  notes;

  constructor(private router: Router , private noteService: NoteService) { }

  ngOnInit() {


    this.noteService.getNotes(this.getNotePath, this.token).subscribe(
      result => {
        this.notes = result.data;
      },
      err => { console.log('Failed to fetch notes'); }

    );
  }

}
