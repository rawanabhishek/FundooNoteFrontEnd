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


  get(path, emailIdToken,  archive, trash): Observable<any> {
    console.log('pin - archive - trash',  archive, trash);
    return this.http.get<any>(this.baseUrl + path, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('archive', archive).append('trash', trash)
    });
  }


  post({ path, data, emailIdToken }: { path; data; emailIdToken; }): Observable<any> {
    console.log('data=>', data);
    return this.http.post(this.baseUrl + path, data, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }

  put(path, data, emailIdToken, id): Observable<any> {
    return this.http.put<any>(this.baseUrl + path, data, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', id)
    });
  }



  delete(path, emailIdToken, id): Observable<any> {
    return this.http.delete<any>(this.baseUrl + path, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', id)
    });
  }

  updateReminder(getNotePath, reminder, emailIdToken, noteId): Observable<any> {
    return this.http.put<any>(this.baseUrl + getNotePath, null, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
      , params: new HttpParams().append('noteId', noteId).append('date', reminder)
    });

  }

  label(getNotePath, emailIdToken, noteId, labelId): Observable<any> {
    return this.http.put<any>(this.baseUrl + getNotePath, null, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('noteId', noteId).append('labelId', labelId)

    });
  }


  searchByTitleDescription(getNotePath, searchValue, emailIdToken): Observable<any> {
    return this.http.get<any>(this.baseUrl + getNotePath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('searchString', searchValue)
    });
  }

  getProfilePic(getProfilePath, emailIdToken): Observable<any> {
    return this.http.get<any>(getProfilePath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }

  getCollaboratorProfilePic(getProfilePath, collaboratorEmailId): Observable<any> {
    return this.http.get<any>(getProfilePath, {
      headers: new HttpHeaders().append('collaboratorEmailId', collaboratorEmailId)
    });
  }

  setProfilePic(getProfilePath, emailIdToken, profilePic): Observable<any> {
    return this.http.put<any>(getProfilePath, profilePic, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),

    });
  }

  removeProfilePic(getProfilePath, emailIdToken): Observable<any> {
    return this.http.put<any>(getProfilePath, {}, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken)
    });
  }

  getNoteByLabel(getNotePath, emailIdToken, labelId): Observable<any> {
    return this.http.get<any>(this.baseUrl + getNotePath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken),
      params: new HttpParams().append('labelId', labelId)

    });
  }


  getCollabOwnerProfilePic(getNotePath, emailIdToken, noteId, collabEmail): Observable<any> {
    return this.http.get<any>(this.baseUrl + getNotePath, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken).append('emailIdCollaborator', collabEmail),
      params: new HttpParams().append('noteId', noteId)
    });
  }

  collaborator(getNotePath, emailIdToken, noteId, collabEmail): Observable<any> {
    return this.http.put<any>(this.baseUrl + getNotePath, {}, {
      headers: new HttpHeaders().append('emailIdToken', emailIdToken).append('collaboratorEmailId', collabEmail),
      params: new HttpParams().append('noteId', noteId)
    });
  }

  getCollaborator(getNotePath, collabEmail): Observable<any> {
    return this.http.get<any>(this.baseUrl + getNotePath , {
      headers: new HttpHeaders().append('emailIdCollaborator', collabEmail)
    });
  }






}
