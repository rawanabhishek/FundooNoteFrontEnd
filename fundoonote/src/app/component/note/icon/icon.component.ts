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






  constructor(private noteService: NoteService, private snackBar: MatSnackBar) { }

  ngOnInit() {

  }




  changeColor(color: string): void {
    this.messageEvent.emit(color);

  }
  deleteNote() {
    this.noteService.deleteNotes(this.getNotePathTrash, this.token, 2).subscribe(
      response => {
        this.snackBar.open('Note deleted successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Note deletion failed', 'close')._dismissAfter(2000);
      }
    );

   }

  //  archiveNote() {
  //   this.noteService.deleteNotes(this.getNotePathArchive, this.token, this.noteId).subscribe(
  //     response => {
  //       this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
  //     },
  //     error => {
  //       return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
  //     }
  //   );




}


