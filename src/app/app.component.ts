import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(
    private cookie: CookieService,
    private router: Router,
    private location: Location
            ) { 
              router.events.subscribe(val => {
                if (location.path() == '/signin') {
                  this.show = false;
                } else {
                  this.show = true;
                };
              });
            };

  cookies: any;
  show: any;

  ngOnInit() {
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
  }


}
