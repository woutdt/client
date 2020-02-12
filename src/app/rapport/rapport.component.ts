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
  x: number;
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
  newvak: any;
  toetsArray: any;
  totalelesuren: any;
  rapporttotaal: any;
  vakpunten: any;
  loopvak: any;


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
    this.rapportTotaal();
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
      this.vak.success = false;
      for(this.f = 0; this.f < this.vak.toetsen.length; this.f++) {
        this.toets = this.vak.toetsen[this.f];
        this.vak.totaal = this.vak.totaal + this.toets.maxscore;
        this.vak.behaald = this.vak.behaald + this.toets.score;
        this.vak.finale = Math.floor(this.vak.behaald/this.vak.totaal * 100);
      }
      if(this.vak.finale < 50) {
        this.vak.danger = true;
      } else if(this.vak.finale == 50) {
        this.vak.warning = true;
     } else if(this.vak.finale == 100) {
        this.vak.success = true;
     } else {
        this.vak.danger = false;
      };
    }
  }
  rapportTotaal() {
    this.vakpunten = 0;
    this.totalelesuren = 0;
    console.log(this.rapportelement)
    for(this.x = 0; this.x < this.rapportelement.vakken.length; this.x++) {
      this.loopvak = this.rapportelement.vakken[this.x];
      if(this.loopvak.finale == undefined) {
        console.log("no toets");
      } else if(this.loopvak.finale) {
        this.totalelesuren = this.totalelesuren + this.loopvak.lesuren;
        this.vakpunten = this.vakpunten + (this.loopvak.finale * this.loopvak.lesuren);
      };
    };
    this.rapporttotaal = Math.round(this.vakpunten / this.totalelesuren);
    console.log(this.rapporttotaal)
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
    this.body = {
      "rapportid": this.cookie.get('rapport'),
      "nieuwtotaal": this.rapporttotaal
    };
    this.http.put('http://localhost:3000/api/rapportTotaal', this.body, httpOptions)
      .subscribe(data => {
        console.log(data)
      });
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
    this.body = {
      "lesuren": this.lesuren,
      "name": this.name,
      "rapportid": rapportid
    };
    this.http.put('http://localhost:3000/api/rapportvak', this.body, httpOptions)
      .subscribe(outcome => {
        this.toetsArray = []
       for(this.i = 0; this.i < this.split2.length; this.i++) {
         this.array2 = this.split2[this.i];
         this.body2 = {
           "score": this.array2[0],
           "maxscore": this.array2[1],
           "rapportid": rapportid,
           "vakid": outcome
         };
         this.toetsArray.push(this.body2);
         console.log(this.body2);
        this.http.put('http://localhost:3000/api/rapportvaktoets', this.body2, httpOptions)
         .subscribe(data => {
           this.ngOnInit();
         });
       };
     });
  }

}
