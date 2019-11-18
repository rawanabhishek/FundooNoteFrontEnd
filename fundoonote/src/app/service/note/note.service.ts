import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private createNoteUrl = 'http://localhost:8081/user/note/';
  private getLabelUrl = 'http://localhost:8081/user/label/';

  constructor(private http: HttpClient) { }

  createNote(note, emailIdToken): Observable<any> {

    return this.http.post(this.createNoteUrl, note, {
      headers: new HttpHeaders().
        append('emailIdToken', emailIdToken)
    });
  }


  getLabels(emailIdToken): Observable<any> {
    return this.http.get<any>(this.getLabelUrl,  {
      headers: new HttpHeaders().append('emailIdToken' , emailIdToken)
    });
  }
}
