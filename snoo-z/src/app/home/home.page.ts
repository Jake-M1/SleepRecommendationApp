import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { PersonalModelData } from '../data/personalModel-data';
import { UserData } from '../data/user-data';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  user:UserData[] | undefined;
  personal_model:PersonalModelData[] | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

  ngOnInit() {
    
    this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
      this.user = res.map((e:any) =>{
           return new UserData(e.payload.doc.data());
      })
    });
    
    this.firestore.collection('/personal_model').snapshotChanges().subscribe(res =>{
      this.personal_model = res.map((e:any) =>{
           return new PersonalModelData(e.payload.doc.data());
      })
   
    });
    
  }


  logout(){
    
    this.authService.logout();
    //console.log(this.personal_model);
    //console.log(this.user);
  }
}
