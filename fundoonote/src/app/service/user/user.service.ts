import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginUrl = 'http://localhost:8080/user/login';
  private registerUrl = 'http://localhost:8080/user/register';
  private forgotPasswordUrl = 'http://localhost:8080/user/forgotpassword';
  private setPasswordUrl = 'http://localhost:8080/user/setpassword';
  private verifyUrl = 'http://localhost:8080/user/verify';

constructor(private http: HttpClient) { }

loginUser(login): Observable < any > {
  return this.http.put(this.loginUrl, login);
}

registerUser(register): Observable < any> {
  return this.http.post(this.registerUrl, register);
}

forgotPassword(email): Observable < any> {
  return this.http.put<any>(this.forgotPasswordUrl, null,
    { headers: new HttpHeaders().append('email', email)});

}

setPasswordNew(password , token): Observable<any> {
  return this.http.put(this.setPasswordUrl, password, {headers: new HttpHeaders().
    append('token', token)});
}


verifyUser(token): Observable <any> {
  return this.http.put(this.verifyUrl, null, {headers: new HttpHeaders().
    append('token', token)});
}


}
