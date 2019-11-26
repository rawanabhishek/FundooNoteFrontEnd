import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpService } from '../http/http.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl = 'http://localhost:8081/user/';

  emailIdToken = localStorage.getItem('token');
  notes;

  constructor(private http: HttpClient,
              private httpService: HttpService,
              private snackBar: MatSnackBar) { }




  getLabels(getLabelPath, emailIdToken): Observable<any> {
    return this.http.get<any>(this.baseUrl + getLabelPath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }


  createLabels(getLabelPath, name, emailIdToken): Observable<any> {
    return this.http.post<any>(this.baseUrl + getLabelPath, name, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }



  updateColor(getNotePath, color, emailIdToken, noteId): Observable<any> {
    console.log(color);
    return this.http.put<any>(this.baseUrl + getNotePath, null, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', noteId).append('color', color)
    });

  }

  archiveNotes(getNotePath, emailIdToken, noteId): Observable<any> {
    console.log('noteId =>', noteId);
    console.log('emailIdToken =>', emailIdToken);
    return this.http.put<any>(this.baseUrl + getNotePath, {}, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', noteId)
    });
  }





  deleteLabel(getLabelPath, emailIdToken, labelId): Observable<any> {
    return this.http.delete<any>(this.baseUrl + getLabelPath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('labelId', labelId)
    });
  }


  updateLabel(getLabelPath, name, labelId, emailIdToken): Observable<any> {
    return this.http.put<any>(this.baseUrl + getLabelPath, name, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('labelId', labelId)
    });
  }



  getNotes() {


    return this.httpService.get({ path: 'note', emailIdToken: this.emailIdToken });
  }


  deleteNote(id) {
    this.httpService.delete({ path: 'note', emailIdToken: this.emailIdToken, id }).subscribe(
      response => {
        this.snackBar.open('Note has been added to archive successfully', 'close')._dismissAfter(2000);
      },
      error => {
        return this.snackBar.open('Operation  failed', 'close')._dismissAfter(2000);
      }
    );


  }


  updateNote(data, id) {

    this.httpService.put({ path: 'note', data, emailIdToken: this.emailIdToken, id })
      .subscribe(
        response => {
          this.snackBar.open('Note updated successfully', 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open('Note updation failed', 'close')._dismissAfter(2000);
        }
      );
  }

  createNote(data) {
   return  this.httpService.post({ path: 'note', data, emailIdToken: this.emailIdToken });
  }

  trashNote(id) {

    this.httpService.put({ path: 'note/trash', data: {} , emailIdToken: this.emailIdToken, id })
      .subscribe(
        response => {
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );
  }
}
