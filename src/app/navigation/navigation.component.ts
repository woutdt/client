import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  user: any;
  res: any;
  error: any;
  show: any;
  cookies: any;

  constructor(
    private cookie: CookieService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {

    this.identify();

  }
  cookiesl() {
    this.cookies = this.cookie.get('jwt');
    if(this.cookies == undefined) {
      this.show = false;
    } else if(this.cookies.length >= 10){
      this.show = true;
    } else {
      this.show = false;
    }
  };
  identify() {

    const httpOptions = {
      headers: new HttpHeaders({
        'responseType' :'application/json',
        'Access-Control-Allow-Credentials' : 'true',
        'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Methods': 'GET',
         'Access-Control-Allow-Headers': 'application/json',
        'Authorization': 'Bearer '+this.cookie.get('jwt')
      })
    };

    this.user = this.cookie.get('jwt');
    this.http.get("http://localhost:3000/api/userinfo", httpOptions)
      .subscribe(data => {
          this.res = data;
          console.log(this.res);
      },
      error => {
        this.error = error;
        console.log("error");
        this.router.navigate(['/']);
      });
  }

  logOut() {
    this.cookie.delete('jwt');
    this.router.navigate(['/signin']);
  }

  navAcc() {
    this.router.navigate(['/account']);
  }

  navHome() {
    this.router.navigate(['/authenticated']);
  }

  help() {
    window.alert("Soms moet je eens refreshen: het programma heeft waarschijnlijk jouw opdracht al verwerkt maar toont dit nog niet op de 'client' \n \n © Wout De Tollenaere")
  }
}
