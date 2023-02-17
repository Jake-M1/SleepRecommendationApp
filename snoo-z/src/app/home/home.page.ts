import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  

  loggedIn:boolean = false;

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }
}
