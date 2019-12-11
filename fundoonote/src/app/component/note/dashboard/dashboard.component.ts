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
  opened;
  labels;
  notes;
  profilePic: string;
  noteList;
  message: any;
  toggle = true;
  status = 'Enable';
  typeOfNote = '';
  viewLayout = 'row wrap';
  screenType;
  labelIdParam;
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
    private snackBar: MatSnackBar
  ) {
    console.log('dashboard constructor');

  }

  ngOnInit() {



    this.activatedRoute.url.subscribe(response => {
      this.typeOfNote = this.activatedRoute.snapshot.firstChild.paramMap.get('type');
      console.log(' dashboard route event', this.typeOfNote);
      this.receiveView(this.typeOfNote);


    });

    if (this.router.url.includes('/trash') || this.router.url.includes('/archive')) {
      this.typeOfNote = 'trash';
      console.log(this.router.url);
      this.receiveView(this.typeOfNote);
    } else if (this.router.url.includes('/note') || this.router.url.includes('/reminder')) {
      if (this.router.url.includes('/reminder')) {
        this.screenType = 'reminder';
        console.log(this.screenType);

      } else {
        this.typeOfNote = 'note';
        this.receiveView(this.typeOfNote);
      }
    } else {
      this.labelIdParam = this.activatedRoute.snapshot.firstChild.paramMap.get('type');
    }

    console.log(this.router.url);




    this.data.currentLabel.subscribe(label => this.labels = label);
    this.getLabels();

    this.getProfilePicPath();







  }

  receiveView(type) {
    if (type === 'archive' || type === 'trash') {
      this.searchActive = true;
    } else if (type === 'note' || type === 'reminder') {

      this.searchActive = false;
    } else {
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
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.notes.slice())
      );

  }


  displayFn(user?: any): string | undefined {
    return user ? user.title : undefined;
  }

  private _filter(name: string): any[] {

    const filterValue = name.toLowerCase();
    return this.notes.filter(note => note.title.toLowerCase().includes(filterValue));



  }

  getLabels() {
    this.noteService.getLabels().subscribe(
      result => {
        this.labels = result.data;
        this.data.changeLabel(this.labels);
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

  getNotesByReminder() {
    {
      this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
        result => {
          this.notes = result.data.filter(item => item.reminder);
          this.data.changeNotes(this.notes);

        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }

      );
    }


  }


  getNotesByLabel(label) {
    {


      this.noteService.getNotes(this.pin, this.archive, this.trash).subscribe(
        result => {
          this.labelIdParam = label.labelId;
          this.router.navigate(['/dashboard/', label.labelId]);
          this.notes = result.data.filter(item => item.labels.find(j => j.labelId === label.labelId));
          this.data.changeNotes(this.notes);

        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }

      );

      // this.router.navigate(['/dashboard/', label.labelId]);
      // this.notes = label.notes.filter(item => item.trash === false);
      // console.log('aaaaaaa', this.notes);

      // this.data.changeNotes(this.notes);

    }


  }


  openUploadDialog() {
    this.dialog.open(ProfiledialogComponent,
      {
        panelClass: 'myapp-no-padding-dialog',
        width: '350px',
      });
    this.dialog.afterAllClosed.subscribe(
      result => {
        this.getProfilePicPath();
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
    this.search.setValue('');
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
        width: '22vw',
        data: {labelIdParam: this.labelIdParam}
      }
     );

  }



  changeScreen(screenType) {
    if (screenType === 'archive' || screenType === 'trash') {
      this.searchActive = true;
    } else {
      this.searchActive = false;
    }

    this.data.changeScreen(screenType);
    console.log('dashboard screen ', screenType);


  }


  searchByTitleDescription(search) {
    this.noteService.searchByTitleDescription(search).subscribe(
      response => {
        this.data.changeNotes(response.data);
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
