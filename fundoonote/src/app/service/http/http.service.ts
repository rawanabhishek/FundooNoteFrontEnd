import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { log } from 'util';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = 'http://localhost:8081/user/';

  constructor(private http: HttpClient) { }


  get(path, emailIdToken, pin, archive, trash): Observable<any> {
    console.log('pin - archive - trash', pin, archive, trash);
    return this.http.get<any>(this.baseUrl + path, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('pin', pin).append('archive', archive).append('trash', trash)
    });
  }


  post({ path, data, emailIdToken }: { path; data; emailIdToken; }): Observable<any> {
    console.log('data=>', data);
    return this.http.post(this.baseUrl + path, data, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }

  put({ path, data, emailIdToken, id }: { path; data; emailIdToken; id; }): Observable<any> {
    return this.http.put<any>(this.baseUrl + path, data, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', id)
    });
  }



  delete({ path, emailIdToken, id }: { path; emailIdToken; id; }): Observable<any> {
    return this.http.delete<any>(this.baseUrl + path, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', id)
    });
  }

  updateReminder(getNotePath, reminder, emailIdToken, noteId): Observable<any> {
    return this.http.post<any>(this.baseUrl + getNotePath, null, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', noteId).append('date', reminder)
    });

  }

  addLabel(getNotePath, emailIdToken, noteId, labelId): Observable<any> {
    return this.http.put<any>(this.baseUrl + getNotePath, null, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('noteId', noteId).append('labelId', labelId)

    });
  }



}
