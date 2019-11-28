import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar } from '@angular/material';

import { DataService } from 'src/app/service/data/data.service';




@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  token = localStorage.getItem('token');
  notes;
  getNotePathArchive = 'note/archive';

  getNotePathTrash = 'note';
  @Output() messageEvent = new EventEmitter<string>();

  emailIdToken = localStorage.getItem('token');

  @Input() noteId: any;
  pin = false;
  archive = false;
  trash = false;

  reminder: string;





  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private data: DataService
    ) {

  }

  ngOnInit() {
    this.data.currentNote.subscribe(note => this.notes = note);
  }

  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
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

  changeColor(color: string): void {
    this.messageEvent.emit(color);

  }


  archiveNote() {
    this.noteService.archiveNotes(this.getNotePathArchive, this.token, this.noteId).subscribe(
      response => {
        this.getNotes();
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

  onChange(data): void {

    this.noteService.addReminder(this.reminder , this.noteId);
  }

}


