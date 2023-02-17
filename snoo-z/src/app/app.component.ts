import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
  constructor(){

  }
  /*
  constructor(
    private platform: Platform,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp()
  {
    this.platform.ready().then(() => {
      this.authService.authenticationState.subscribe(state => {
        console.log('Auth changed: ', state);
        if (state) {
          this.router.navigate(['pages', 'tab1']);
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
  */
}
