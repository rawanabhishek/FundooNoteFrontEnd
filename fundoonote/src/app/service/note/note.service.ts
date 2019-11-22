import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl = 'http://localhost:8081/user/';


  constructor(private http: HttpClient) { }

  createNote(createNotePath, note, emailIdToken): Observable<any> {

    return this.http.post(this.baseUrl + createNotePath, note, {
      headers: new HttpHeaders().
        append('emailIdToken', emailIdToken)
    });
  }


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

  getNotes(getNotePath, emailIdToken): Observable<any> {
    return this.http.get<any>(this.baseUrl + getNotePath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }


  updateNote(getNotePath, updateData, emailIdToken, noteId): Observable<any> {
    return this.http.put<any>(this.baseUrl + getNotePath, updateData, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', noteId)
    });
  }


}
