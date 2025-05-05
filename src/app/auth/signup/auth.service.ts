import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token!:string | null;
  private tokenTimer!: ReturnType<typeof setTimeout>;
  private userId!: string | null;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response => {
      this.router.navigate(['/login']);
    })
  }

  login(email:string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token:string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
      const token =  response.token
      this.token = token;
      if(this.token) {
        const expiresInduration = response.expiresIn;
        this.setAuthTimer(expiresInduration);
        this.isAuthenticated = true
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expiratioDate = new Date(now.getTime() + expiresInduration * 1000);
        this.saveAuthData(token, expiratioDate, this.userId);
        this.router.navigate(['/']);
      }
    })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation?.expirationDate.getTime()! - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation?.token!;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(()=> {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expiratioDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiratioDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
