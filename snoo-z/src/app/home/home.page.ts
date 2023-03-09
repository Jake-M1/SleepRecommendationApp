import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { PersonalModelData } from '../data/personalModel-data';
import { SleepData } from '../data/sleep-data';
import { UserData } from '../data/user-data';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  user:UserData[] | undefined;

  sleepData = new Map();
  tempData:SleepData[] | undefined;
  personalModel:PersonalModelData | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

  ngOnInit() {
    
    this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
      this.user = res.map((e:any) =>{
           return new UserData(e.payload.doc.data());
      })
    });
    
    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.tempData = res.map((e:any) =>{
           return new SleepData(e.payload.doc.data());    // e.playload.doc.data() returns json object, so we store it as class object 
      })
      this.tempData.forEach((data)=>{
        this.sleepData.set(data['date'], data);           // sleepdata is map date as key and class object as value, all the instance variables can be accessible by using getter
      });
      
    });

    this.firestore.collection('personal_model').doc('pm').get().subscribe(res => {
        this.personalModel = new PersonalModelData(res.data());   //personalmodel contains the optimized values that we generated 
    });
    
  }

  logout(){
    
    this.authService.logout();

  }
}
