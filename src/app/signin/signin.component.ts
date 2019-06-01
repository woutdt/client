import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  res: any;
  f: any;
  error: any;
  cookies: any;
  now: any;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router
            ) { }

  ngOnInit() {

    this.testAuthenticated();
    
  }

  testAuthenticated() {
    this.cookies = this.cookie.get('jwt');
    if(this.cookies == undefined || this.cookies == null || this.cookies == '') {
      console.log(true);
    } else if(this.cookies != undefined) {
      this.router.navigate(['/authenticated']);
    };
  };

  onSubmit(f: NgForm) {

    const httpOptions = {
      headers: new HttpHeaders({
        'email': f.value.name,
        'toegang': f.value.password
      })
    };

    console.log(f.value);
    console.log(f.valid);
    if(f.valid == false) {
      return alert("vergeet je email / wachtwoord niet in te vullen");
    };
    if(f.valid == true) {
      this.http.get("http://localhost:3000/api/authenticate", httpOptions)
          .subscribe(data => {
            this.res = data; 
            this.now = Date.now();
            this.cookie.set('jwt', this.res, new Date(new Date().getTime() + 60 * 60 * 24 * 1000));
            this.router.navigate(['/authenticated']);
          },
          error => {
            this.error = error;
            alert("incorrect email / password. status: "+ error.status +' '+ error)
          });        
    };
  };

}
