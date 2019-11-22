import { Component, OnInit } from '@angular/core';
import { NoteService } from 'src/app/service/note/note.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { DataService } from 'src/app/service/data/data.service';


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

  name = new FormControl();

  constructor(private noteService: NoteService, private snackBar: MatSnackBar , private dataService: DataService) { }

  ngOnInit() {

    this.noteService.getLabels(this.getLabelsPath, this.token).subscribe(
      result => {
        this.labels = result.data;
      },
      err => { console.log('failed to load labels'); }

    );

  }


  createLabel() {
    this.data = {
      name: this.name.value
    };

    this.noteService.createLabels(this.getLabelsPath, this.data, this.token).subscribe(
      result => {
        this.snackBar.open('Label created successfully', 'close')._dismissAfter(2000);
        this.getLabels();
        this.dataService.changeLabel(this.labels);
        this.dataService.currentLabel.subscribe(label => this.labels = label);
      },
      error => { this.snackBar.open('Label creation failed', 'close')._dismissAfter(2000); }

    );
  }



  getLabels() {
    this.noteService.getLabels(this.getLabelsPath, this.token).subscribe(
      result => {
        this.labels = result.data;
      },
      err => { console.log('failed to load labels'); }

    );


    }
  }
