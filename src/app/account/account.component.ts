import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookie: CookieService
  ) { }

  ngOnInit() {

    this.identify()

  }

  res: any;
  user: any;
  error: any;

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
      });
  }

}
