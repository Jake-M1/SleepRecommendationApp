import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { UserData } from '../data/user-data';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  user:UserData[] | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

  ngOnInit() {
    
    this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
      this.user = res.map((e:any) =>{
           return new UserData(e.payload.doc.data());
      })
    });
    
  }


  logout(){
    this.authService.logout();
  
    //console.log(this.user);
  }
}
