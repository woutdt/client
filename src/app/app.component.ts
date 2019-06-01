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


  ngOnInit() {

    this.cookiesl()
    
  }

  cookiesl() {
    this.cookies = this.cookie.get('jwt');
  }


}
