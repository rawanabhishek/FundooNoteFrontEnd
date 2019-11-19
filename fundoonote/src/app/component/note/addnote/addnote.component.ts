import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from 'src/app/service/note/note.service';

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
  data: any;
  createNotePath = 'note';


  constructor(private snackBar: MatSnackBar, private noteService: NoteService) { }

  ngOnInit() {
  }

  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }

  createNote() {

    this.data = {
      title: this.title.value,
      description: this.description.value
    };

    this.noteService.createNote(this.createNotePath, this.data, this.emailIdToken)
      .subscribe(
        response => {
          this.snackBar.open('note created success', 'close')._dismissAfter(2000);

        },
        error => {
          return this.snackBar.open('note creation failed', 'close')._dismissAfter(2000);
        }
      );
  }





}


