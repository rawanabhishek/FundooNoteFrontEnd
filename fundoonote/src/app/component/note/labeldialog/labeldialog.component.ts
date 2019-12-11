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
  getLabelsPath = 'label';
  showDelete = false;
  labelId;
  pin = false;
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
      this.pin = false;

    } else if (this.router.url.includes('/archive')) {
      this.trash = false;
      this.archive = true;
      this.pin = false;

    } else if (this.router.url.includes('/note')) {
      this.trash = false;
      this.archive = false;
      this.pin = false;

    } else {
      this.trash = false;
      this.archive = false;
      this.pin = false;
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
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        if (this.router.url.includes(this.labelIdParam)) {
          console.log('update color in labels', this.labelIdParam);
          this.getNotesByLabel(this.labelIdParam);
        } else if (this.router.url.includes('reminder')) {
          this.getNotesByReminder();
        } else {
          this.dataService.changeNotes(result.data);
        }
      },
      error => {
        this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );
  }



  getNotesByReminder() {
    {
      this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
        result => {
          this.dataService.changeNotes(result.data.filter(item => item.reminder));


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

        this.dataService.changeNotes(result.data);

      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      });

  }
}
