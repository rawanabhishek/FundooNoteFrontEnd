import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { MatSnackBar, MatDialog } from '@angular/material';

import { DataService } from 'src/app/service/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CollaboratorComponent } from '../collaborator/collaborator.component';







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

  @Input() noteData: '';
  @Input() noteId: any;
  pin = false;
  archive = false;
  trash = false;
  showAddLabel = false;
  unarchive = false;
  datetime;
  reminder: string;
  labels: any;
  labelIdParam;

  // @Input() screens = '';

  typeOfNote = '';





  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private data: DataService,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) {

  }

  ngOnInit() {




    if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.archive = false;
      this.pin = false;
      this.unarchive = false;

    } else if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;
      this.pin = false;
      this.unarchive = true;

    } else if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;
      this.pin = false;
      this.unarchive = false;

    } else if (this.router.url.includes('/reminder')) {
      this.trash = false;
      this.archive = false;
      this.pin = false;
      this.unarchive = false;

    } else {
      this.trash = false;
      this.archive = false;
      this.pin = false;
      this.unarchive = false;
      this.labelIdParam = this.activatedRoute.snapshot.firstChild.paramMap.get('type');

    }

    this.getLabels();
    this.data.currentLabel.subscribe(label => this.labels = label);
    this.data.currentNote.subscribe(note => this.notes = note);
  }




  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        if (this.router.url.includes(this.labelIdParam)) {
          console.log('update color in labels', this.labelIdParam);
          this.getNotesByLabel(this.labelIdParam);
        } else if (this.router.url.includes('reminder')) {
          this.getNotesByReminder();
        } else {
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
          this.data.changeNotes(this.notes);
        }

      }
      ,
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
        console.log('label id get notes by label', labelId);

        this.notes = result.data;
        this.data.changeNotes(this.notes);
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
        console.log('list of notes by label', this.notes);

      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      });

  }





  getLabels() {
    this.noteService.getLabels().subscribe(
      result => {
        this.labels = result.data;
        this.data.changeLabel(this.labels);
      },
      error => {
        this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }
    );
  }

  showAddLabels($event) {
    $event.stopPropagation();
    this.showAddLabel = this.showAddLabel ? false : true;
  }


  onChange(data) {
    console.log('data is => ', data);

    this.messageEvent.emit(data);


  }










}


