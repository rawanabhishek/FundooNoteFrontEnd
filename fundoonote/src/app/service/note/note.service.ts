import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private baseUrl = 'http://localhost:8081/user/';
 

  constructor(private http: HttpClient) { }

  createNote(createNotePath ,note, emailIdToken): Observable<any> {

    return this.http.post(this.baseUrl + createNotePath, note, {
      headers: new HttpHeaders().
        append('emailIdToken', emailIdToken)
    });
  }


  getLabels(getLabelPath, emailIdToken): Observable<any> {
    return this.http.get<any>(this.baseUrl + getLabelPath,  {
      headers: new HttpHeaders().append('emailIdToken' , emailIdToken)
    });
  }
}
