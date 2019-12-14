import { Component, OnInit, Inject } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/service/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-labeldialog',
  templateUrl: './labeldialog.component.html',
  styleUrls: ['./labeldialog.component.scss']
})
export class LabeldialogComponent implements OnInit {

  token = localStorage.getItem('token');
  labels;
  data: any;
  notes;
  getLabelsPath = 'label';
  showDelete = false;
  labelId;
  archive = false;
  trash = false;
  labelIdParam;
  name = new FormControl();
  updatedName = new FormControl();

  constructor(
    private noteService: NoteService,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    public dialogRef: MatDialogRef<LabeldialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dataLabel: any,
    private router: Router,
  ) { }

  ngOnInit() {

    console.log('note dialog inint');

    if (this.router.url.includes('/trash')) {
      this.trash = true;
      this.archive = false;


    } else if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;


    } else if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;


    } else {
      this.trash = false;
      this.archive = false;
    }

    this.labelIdParam = this.dataLabel.labelIdParam;
    console.log('label dialog labelIdParam', this.labelIdParam);

    this.getLabels();
    this.dataService.currentLabel.subscribe(label => this.labels = label);
  }


  createLabel() {
    this.data = {
      name: this.name.value
    };

    if (this.data.name != null) {
      this.noteService.createLabels(this.getLabelsPath, this.data, this.token).subscribe(
        result => {
          this.snackBar.open('Label created successfully', 'close')._dismissAfter(2000);
          this.getLabels();
        },
        error => { this.snackBar.open('Label creation failed', 'close')._dismissAfter(2000); }

      );
      this.name.reset();
    }
  }



  getLabels() {
    this.noteService.getLabels().subscribe(
      result => {
        this.labels = result.data;
        this.dataService.changeLabel(this.labels);
      },
      err => { console.log('failed to load labels'); }

    );


  }


  deleteLabel(labelId) {

    this.noteService.deleteLabel(this.getLabelsPath, this.token, labelId).subscribe(
      result => {
        this.snackBar.open('Label deleted successfully', 'close')._dismissAfter(2000);
        this.getLabels();
        this.getNotes();

      },
      error => { this.snackBar.open('Label deletion failed', 'close')._dismissAfter(2000); }

    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  updateLabel(labelId) {
    this.data = {
      name: this.updatedName.value
    };
    if (this.data.name !== '') {
      this.noteService.updateLabel(this.getLabelsPath, this.data, labelId, this.token).subscribe(
        result => {
          this.snackBar.open('Label updated successfully', 'close')._dismissAfter(2000);
          this.getLabels();
          this.getNotes();
        },
        error => { this.snackBar.open('Label updation failed', 'close')._dismissAfter(2000); }
      );
    }
  }



  getNotes() {
    this.noteService.getNotes(this.archive, this.trash).subscribe(
      result => {

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
        if (this.router.url.includes(this.labelIdParam)) {
          console.log('update color in labels', this.labelIdParam);
          // tslint:disable-next-line: triple-equals
          this.notes = this.notes.filter(i => i.labels.find(j => j.labelId == this.labelIdParam));
        } else if (this.router.url.includes('reminder')) {
          this.notes = this.notes.filter(i => i.reminder);
        }

        this.dataService.changeNotes(this.notes);



      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }

}
