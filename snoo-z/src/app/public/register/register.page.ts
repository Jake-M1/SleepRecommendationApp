import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  useremail:string = "";
  password:string = "";
  repassword:string = "";

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  register(){
    
    if(this.useremail === ""){
      alert("Enter the email");
    }else if(this.repassword === "" || this.password === ""){
      alert("Enter the password");
    }

    if(this.password === this.repassword){

      if(this.password.length < 6 ){
        alert("Password should be at least 6 characters");
      }else{
        this.authService.register(this.useremail,this.password);
      }
    }else{
      alert("password does not match");
    }

  }
}
