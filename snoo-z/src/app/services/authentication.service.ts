import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

//import { Storage } from '@ionic/storage-angular';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user:string = "";
  authenticationState = new BehaviorSubject(false);

  constructor(private auth: AngularFireAuth, private router: Router, private platform: Platform) {
    //this.storage.create();
    this.platform.ready().then(() => {
      //this.checkToken();
    });
  }

  login(email: string, password: string){
    
    if(email.length == 0 || password.length == 0){
      alert("Enter email and password");
    }else{
    this.auth.signInWithEmailAndPassword(email,password).then( (data) =>{
        //localStorage.setItem('token','true');
        alert("successfully signed in!");
        console.log(data);
        this.user = email;
        this.router.navigate(['home']);
    }).catch(err =>{
        alert("Failed to find the user. The error could be either username does not exist or password does not match");
    });
    }
  }

  logout(){
    this.auth.signOut().then(() =>{
      alert("successfully logged out!");
      this.router.navigate(['login']);
    }).catch(err =>{
      alert(err.message);
    });
  }

  register(email: string, password: string){
      this.auth.createUserWithEmailAndPassword(email,password).then( (data) =>{
          console.log(data);
          alert("successfully signed up!");
          this.router.navigate(['login']);
      }, err =>{
          alert("Email is not Valid");

      })
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  checkToken() {
    
    this.auth.fetchSignInMethodsForEmail(this.user).then( result =>{
      
      if(result.length > 0){
        this.authenticationState.next(true);
      }
    })
    
  }
  
}
