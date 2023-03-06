import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs = ["This is dummy data", "Sleep Earlier", "Sleep Later", "Stop caffeine intake"];
  showing: boolean = true;

  personalModel = {
    'total_sleep_duration': 28918.86, 
    'awake_time': 1404.85, 
    'bedtime_start': '21:12:18', 
    'bedtime_end': '05:37:41', 
    'steps': 8676.46, 
    'alcohol': 0.01, 
    'water': 2983.76, 
    'sugar': 110.5, 
    'caffeine': 334.47, 
    'caffeine_before': 332.25, 
    'caffeine_after': 2.22
  }

  private model:PersonalModelData = new PersonalModelData(this.personalModel);

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {}
  ngOnInit(): void {
    console.log(this.model.awake_time);
    
    // this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
    //   this.model = res.map((e:any) =>{
    //     return new PersonalModelData(e.payload.doc.data());
    //   })
    //   this.model?.forEach((data) =>{
    //     console.log(data['caffeine_before']);
    //   });
    // })

    // console.log(this.model);
  }

}
