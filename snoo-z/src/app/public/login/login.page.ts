import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  useremail:string = "";
  password:string = "";

  constructor(private authService: AuthenticationService) {

  }

  ngOnInit() {
  }

  login() {

    this.authService.login(this.useremail,this.password);
  }
}
