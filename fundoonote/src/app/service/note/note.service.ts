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

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private snackBar: MatSnackBar) { }




  getLabels(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'label', {
      headers: new HttpHeaders().append('emailIdToken', this.emailIdToken)
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



  archiveNotes(id) {

    return this.httpService.put( 'note/archive',  {},  this.emailIdToken, id );

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



  getNotes(pin, archive, trash) {


    return this.httpService.get('note', this.emailIdToken, pin, archive, trash);
  }

  addLabel(noteId, labelId) {
    return this.httpService.label('note/label', this.emailIdToken, noteId, labelId);

  }

  removeLabel(noteId, labelId) {
    return this.httpService.label('note/removelabel', this.emailIdToken, noteId, labelId);
  }


  deleteNote(id) {
   return  this.httpService.delete( 'note', this.emailIdToken, id );
  }


  updateNote(data, id) {

    return this.httpService.put( 'note', data,  this.emailIdToken, id );
  }

  createNote(data) {
    return this.httpService.post({ path: 'note', data, emailIdToken: this.emailIdToken });
  }

  trashNote(id) {

    return this.httpService.put( 'note/trash',  {},  this.emailIdToken, id );

  }

  removeReminder(id) {
    return this.httpService.put( 'note/removeremainder', {}, this.emailIdToken, id );
  }



  pinNote(id) {

    this.httpService.put('note/pin', {},  this.emailIdToken, id )
      .subscribe(
        response => {
          this.snackBar.open(response.message, 'close')._dismissAfter(2000);
        },
        error => {
          return this.snackBar.open(error.error.message, 'close')._dismissAfter(2000);
        }
      );
  }

  addReminder(reminder, id) {
    return this.httpService.updateReminder('note/updatereminder', reminder, this.emailIdToken, id);


  }


  searchByTitleDescription(searchValue) {
    return this.httpService.searchByTitleDescription('note/title/description', searchValue , this.emailIdToken);
  }

  getProfilePic() {
    return this.httpService.getProfilePic('http://localhost:8080/user/profilepic', this.emailIdToken);
  }

  setProfilePic(profilePic) {
    return this.httpService.setProfilePic('http://localhost:8080/user/updateprofilepic', this.emailIdToken, profilePic);

  }

  removeProfilePic() {
    return this.httpService.removeProfilePic('http://localhost:8080/user/removeprofilepic' , this.emailIdToken);
  }

  untrash(noteId) {
    return this.httpService.put( 'note/trash',  {} ,  this.emailIdToken, noteId );
  }





}
