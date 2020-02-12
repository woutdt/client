import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(
    private cookie: CookieService,
            ) { }

  cookies: any;
  show: any;

  ngOnInit() {

    this.cookiesl()
    
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
