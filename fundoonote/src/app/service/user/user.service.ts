import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) { }

  loginUser(loginPath,login): Observable<any> {
    return this.http.put(this.baseUrl + loginPath, login);
  }

  registerUser(registerPath,register): Observable<any> {
    return this.http.post(this.baseUrl + registerPath, register);
  }

  forgotPassword(forgotPasswordPath, email): Observable<any> {
    return this.http.put<any>(this.baseUrl + forgotPasswordPath, null,
      { headers: new HttpHeaders().append('email', email) });

  }
  setPasswordNew(setPasswordPath ,password, token): Observable<any> {

    return this.http.put(this.baseUrl + setPasswordPath, password, {
      headers: new HttpHeaders().
        append('token', token)
    });
  }


  verifyUser(verifyPath,token): Observable<any> {
    return this.http.put(this.baseUrl + verifyPath, null, {
      headers: new HttpHeaders().
        append('token', token)
    });
  }


}
