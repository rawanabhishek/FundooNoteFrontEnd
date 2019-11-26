import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar } from '@angular/material';

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




  constructor(private noteService: NoteService, private snackBar: MatSnackBar) { }

  ngOnInit() {

  }


  deleteNote() {
    this.noteService.trashNote(this.noteId);
  }

  changeColor(color: string): void {
    this.messageEvent.emit(color);

  }


  archiveNote() {
    this.noteService.archiveNotes(this.getNotePathArchive, this.token, this.noteId).subscribe(
      response => {
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );




  }
}
