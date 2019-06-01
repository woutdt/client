import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.css']
})
export class RapportComponent implements OnInit {

  nameControl = new FormControl('');

  error: any;
  user: any;
  res: any;
  rapportid: any;
  rapportelement: any;
  i: number;
  f: number;
  c: number;
  total: any;
  behaald: any;
  vak: any;
  toets: any;
  danger: boolean;
  lesuren= '';
  toetsen= '';
  name = '';
  split1: any;
  split2: any;
  body;
  body2;
  array2;


  constructor(
    private cookie: CookieService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.identify();
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
          this.identifyRapport();
      },
      error => {
        this.error = error;
        console.log("error");
      });
  }

  identifyRapport() {
    this.rapportid = this.cookie.get('rapport');
    this.rapportelement = this.arrayCheck(this.rapportid);
    this.vakTotaal(this.rapportelement);
  }

  arrayCheck(id: any) {
    for (this.i = 0; this.i < this.res.rapporten.length; this.i++) { 
      if(this.res.rapporten[this.i]._id == id) {
        return this.res.rapporten[this.i];
      }
    }
  }
  vakTotaal(rapportelement: any){
    for(this.c = 0; this.c < rapportelement.vakken.length; this.c++) {
      this.vak = rapportelement.vakken[this.c];
      this.vak.totaal = 0;
      this.vak.behaald = 0;
      this.vak.finale = 0;
      this.vak.danger = false;
      this.vak.warning = false;
      for(this.f = 0; this.f < this.vak.toetsen.length; this.f++) {
        this.toets = this.vak.toetsen[this.f];
        this.vak.totaal = this.vak.totaal + this.toets.maxscore;
        this.vak.behaald = this.vak.behaald + this.toets.score;
        this.vak.finale = Math.floor(this.vak.behaald/this.vak.totaal * 100);
        if(this.vak.finale < 50) {
          this.vak.danger = true;
        } else if(this.vak.finale == 50) {
          this.vak.warning = true;
        } else {
          this.vak.danger = false;
        };
      }
      console.log(this.rapportelement.vakken[this.c]);
    }
  }
  
  alert(rapportid: any) {
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
    this.split1 = this.toetsen.split("_");
    this.split2 = [];
    for(this.i = 0; this.i < this.split1.length; this.i++) {
      this.split2.push(this.split1[this.i].split("/"));
    }
    console.log(this.split2);
    this.body = {
      "lesuren": this.lesuren,
      "name": this.name,
      "rapportid": rapportid
    };
    this.http.put('http://localhost:3000/api/rapportvak', this.body, httpOptions)
      .subscribe(data => {
       for(this.i = 0; this.i < this.split2.length; this.i++) {
         this.array2 = this.split2[this.i];
         this.body2 = {
           "score": this.array2[0],
           "maxscore": this.array2[1],
           "rapportid": rapportid,
           "vakname": this.name
         }
        this.http.put('http://localhost:3000/api/rapportvaktoets', this.body2, httpOptions)
       };
     });
  }

}
