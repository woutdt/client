import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})
export class AuthenticatedComponent implements OnInit {

  user: any;
  res: any;
  error: any;
  showcard: boolean;
  name: string;
  periode: any;
  checkoutForm;
  useless: any;
  rapportidObj: any;
  showedit: boolean;


  constructor(
    private cookie: CookieService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      periode: ''
    });
   }

  ngOnInit() {

    this.identify();
    this.showcard = true;
    this.showedit = false;

  }

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

  onSubmit(card) {
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
    this.http.post("http://localhost:3000/api/rapport", card ,httpOptions)
      .subscribe(data => {
        this.useless = data;
      });
    window.location.reload(); 
  }


  deleteFunc(rapportid: any) {
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
    this.rapportidObj = {
      "rapportid": rapportid
    };
    this.http.put("http://localhost:3000/api/delrapport",this.rapportidObj , httpOptions)
      .subscribe(data => {
        console.log(data);
        this.useless = data;
        window.location.reload();
      });
  }

  editFunc() {
    alert("coming soon...");
  }

  openRapport(id: any) {
    this.cookie.set('rapport', id, new Date(new Date().getTime() + 60 * 60 * 24 * 1000));
    this.router.navigate(['/rapport']);
  }

  logOut() {
    this.cookie.delete('jwt');
    this.router.navigate(['/signin']);
  }

  navAcc() {
    this.router.navigate(['/account']);
  }

  addNewRapport() {
    this.showcard = false;
  }

  normalMode() {
    this.showcard = true;
  }


}
