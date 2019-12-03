import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NoteService } from 'src/app/service/note/note.service';
import { DataService } from 'src/app/service/data/data.service';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { LabeldialogComponent } from '../labeldialog/labeldialog.component';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ProfiledialogComponent } from '../profiledialog/profiledialog.component';
import { getType } from '@angular/flex-layout/extended/typings/style/style-transforms';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  token = localStorage.getItem('token');
  email = localStorage.getItem('email');

  showContent = true;
  showClear = true;
  showView = true;

  pin = false;
  archive = false;
  trash = false;

  labels;
  notes;
  profilePic: string;

  message: any;
  toggle = true;
  status = 'Enable';
  typeOfNote = '';
  viewLayout = 'row wrap';


  selectedId: any;
  searchActive = false;

  search = new FormControl('');
  filteredOptions: Observable<string[]>;



  constructor(
    private router: Router,
    private noteService: NoteService,
    private dialog: MatDialog,
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {


    this.typeOfNote = this.activatedRoute.snapshot.paramMap.get('type');
    console.log('dashboard' , this.typeOfNote);
    this.data.currentLabel.subscribe(label => this.labels = label);
    this.getLabels();
    console.log('dashboard type ', this.typeOfNote);

    this.data.changeLabel(this.labels);
    this.getNotes();
    this.getProfilePicPath();







  }

  receiveView(type) {
    if (type === 'archive' || type === 'trash') {
      console.log('dashbaord', type);

      this.searchActive = true;
    } else {
      console.log('dashbaord', type);
      this.searchActive = false;
    }
  }


  hideAddNotes() {
    this.searchActive = false;
  }

  searching() {
    this.getNotes();
    this.filteredOptions = this.search.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }


  displayFn(subject) {
    return subject ? subject.name : undefined;
  }

  private _filter(value: string): any[] {
    console.log('1234', this.notes);
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.notes.filter(note => note.title.toLowerCase().includes(filterValue));

    }

  }

  getLabels() {
    this.noteService.getLabels().subscribe(
      result => {
        this.labels = result.data;
        console.log('labels list--->', this.labels);

      },
      err => { console.log('failed to load labels'); }

    );
  }

  getNotes() {
    this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
      result => {
        this.notes = result.data;
        this.data.changeNotes(this.notes);
        console.log('list of notes', this.notes);


      },
      error => {
        return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
      }

    );
  }


  openUploadDialog() {
    this.dialog.open(ProfiledialogComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        width: '350px',
      });
    this.dialog.afterAllClosed.subscribe(
      result => {
        this.ngOnInit();
      }
    );

  }


  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);

  }





  showHidddenContent() {
    this.showContent = this.showContent ? false : true;
  }

  clear() {
    this.showClear = this.showClear ? false : true;

  }

  activate() {
    this.searchActive = true;
    this.searching();
  }

  closeSearch() {
    this.searchActive = false;
    this.getNotes();
    this.search.reset();
  }


  view() {
    this.showView = this.showView ? false : true;
    console.log('before', this.viewLayout);



  }

  changeView() {
    if (this.viewLayout === 'row wrap') {
      this.viewLayout = 'column';
    } else {
      this.viewLayout = 'row wrap';
    }
  }


  openDialogLabel() {
    this.dialog.open(LabeldialogComponent,
      {
        width: '22vw'
      });

  }


  searchByTitleDescription(search) {
    this.noteService.searchByTitleDescription(search).subscribe(
      response => {
        this.data.changeNotes(response.data);
        console.log('baot', response);
      },
      error => {
        console.log('Operation failed');

      }
    );
  }


  getProfilePicPath() {
    this.noteService.getProfilePic().subscribe(
      response => {

        this.profilePic = response.data;


      },
      error => {
        console.log('Operation failed');

      }
    );

  }








}
