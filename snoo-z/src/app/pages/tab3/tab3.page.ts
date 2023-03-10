import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserData } from 'src/app/data/user-data';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs = ["Reduce alchohol intake", "Sleep Earlier", "Sleep Later", "Stop caffeine intake in the evening", "Reduce caffeine intake during the day"];
  showing: boolean = true;
  recentDate = new Date(2000, 0, 1);
  date = new Date();

  // recentModel = {
  //   'total_sleep_duration': 0, 
  //   'awake_time': 1404.85, 
  //   'bedtime_start': '', 
  //   'bedtime_end': '', 
  //   'steps': 0, 
  //   'alcohol': 0, 
  //   'water': 0, 
  //   'sugar': 0, 
  //   'caffeine': 0, 
  //   'caffeine_before': 0, 
  //   'caffeine_after': 0
  // }
  recentModel = {
    total_sleep_duration : 30000,
    awake_time : 1000,
    bedtime_start : '21:12:18',
    bedtime_end : '05:37:41',
    steps : 7000,
    alcohol : 0.02,
    water : 0,
    sugar : 200,
    caffeine : 300,
    caffeine_before : 200,
    caffeine_after : 100
  }

  percentDiffs = {
    'total_sleep_duration': 0, 
    'awake_time': 1404.85, 
    'bedtime_start': '', 
    'bedtime_end': '', 
    'steps': 0, 
    'alcohol': 0, 
    'water': 0, 
    'sugar': 0, 
    'caffeine': 0, 
    'caffeine_before': 0, 
    'caffeine_after': 0
  }

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

  //private model:PersonalModelData = new PersonalModelData(this.personalModel);
  private model:PersonalModelData[] | undefined;
  private user:UserData[] | undefined;

  percentDifference(newValue: number, oldValue: number): number {
    if(oldValue == newValue){
      console.log("ALCH");
      return 0;
    }
    console.log(oldValue);
    if(oldValue == 0 || newValue == 0){
      return 100;
    }
    const difference = Math.abs(newValue - oldValue);
    const percent = (difference / newValue) * 100;
    return percent;      


  }

  createDate(date:String){
   const dateArr = date.split("-");
   return new Date(Number(dateArr[0]), Number(dateArr[1])-1, Number(dateArr[2]));
  }

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {}
  
  ngOnInit(): void {
    //console.log(this.model.awake_time);

    this.firestore.collection('/personal_model').snapshotChanges().subscribe(res =>{
      this.model = res.map((e:any) =>{
        return new PersonalModelData(e.payload.doc.data());
      })
    //   this.model?.forEach((data) =>{
    //     console.log(data['caffeine_before']);
    //   });
    })

    console.log("model", " ", this.model);

    
    this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
      this.user = res.map((e:any) =>{
        return new UserData(e.payload.doc.data());
      })
      this.user?.forEach((data) =>{
        this.date = this.createDate(data['date']);
        if(this.recentDate == null){
          this.recentDate = this.date;
          // this.recentModel['total_sleep_duration'] = data['total_sleep_duration'];
          // this.recentModel['awake_time'] = data['awake_time'];
          // this.recentModel['bedtime_start'] = data['bedtime_start'];
          // this.recentModel['bedtime_end'] = data['bedtime_end'];
          // this.recentModel['steps'] = data['steps'];
          // this.recentModel['alcohol'] = data['alcohol'];
          // this.recentModel['water'] = data['water'];
          // this.recentModel['sugar'] = data['sugar'];
          // this.recentModel['caffeine'] = data['caffeine'];
          // this.recentModel['caffeine_before'] = data['caffeine_before'];
          // this.recentModel['caffeine_after'] = data['caffeine_after'];
          this.recentModel['total_sleep_duration'] = 30000;
          this.recentModel['awake_time'] = 1000;
          this.recentModel['bedtime_start'] = '21:12:18';
          this.recentModel['bedtime_end'] = '05:37:41';
          this.recentModel['steps'] = data['steps'];
          this.recentModel['alcohol'] = 0.02;
          this.recentModel['water'] = 0;
          this.recentModel['sugar'] = 200;
          this.recentModel['caffeine'] = 300;
          this.recentModel['caffeine_before'] = 200;
          this.recentModel['caffeine_after'] = 100;
        }else if(this.date > this.recentDate){
          this.recentDate = this.date;
          // this.recentModel['total_sleep_duration'] = data['total_sleep_duration'];
          // this.recentModel['awake_time'] = data['awake_time'];
          // this.recentModel['bedtime_start'] = data['bedtime_start'];
          // this.recentModel['bedtime_end'] = data['bedtime_end'];
          // this.recentModel['steps'] = data['steps'];
          // this.recentModel['alcohol'] = data['alcohol'];
          // this.recentModel['water'] = data['water'];
          // this.recentModel['sugar'] = data['sugar'];
          // this.recentModel['caffeine'] = data['caffeine'];
          // this.recentModel['caffeine_before'] = data['caffeine_before'];
          // this.recentModel['caffeine_after'] = data['caffeine_after'];
          this.recentModel['total_sleep_duration'] = 30000;
          this.recentModel['awake_time'] = 1000;
          this.recentModel['bedtime_start'] = '21:12:18';
          this.recentModel['bedtime_end'] = '05:37:41';
          this.recentModel['steps'] = data['steps'];
          this.recentModel['alcohol'] = 0.02;
          this.recentModel['water'] = 0;
          this.recentModel['sugar'] = 200;
          this.recentModel['caffeine'] = 300;
          this.recentModel['caffeine_before'] = 200;
          this.recentModel['caffeine_after'] = 100;
        }
      });

    });

    console.log("recent model", this.recentModel);
    console.log("%", this.percentDiffs);
    console.log(this.recentModel.alcohol, " ",this.personalModel['total_sleep_duration']);
    console.log("recent model", this.recentModel);
    this.percentDiffs['total_sleep_duration'] = this.percentDifference(this.recentModel['total_sleep_duration'], this.personalModel['total_sleep_duration']);
    this.percentDiffs['awake_time'] = this.percentDifference(this.recentModel['awake_time'], this.personalModel['awake_time']);
    // this.percentDiffs['bedtime_start'] = this.percentDifference(this.recentModel['bedtime_start'], this.personalModel[''bedtime_start]);
    // this.percentDiffs['bedtime_end'] = this.percentDifference(this.recentModel['bedtime_end'], this.personalModel['bedtime_end']);
    this.percentDiffs['steps'] = this.percentDifference(this.recentModel['steps'], this.personalModel['steps']);
    this.percentDiffs['alcohol'] = this.percentDifference(this.recentModel['alcohol'], this.personalModel['alcohol']);
    this.percentDiffs['water'] = this.percentDifference(this.recentModel['water'], this.personalModel['water']);
    this.percentDiffs['sugar'] = this.percentDifference(this.recentModel['sugar'], this.personalModel['sugar']);
    this.percentDiffs['caffeine'] = this.percentDifference(this.recentModel['caffeine'], this.personalModel['caffeine']);
    this.percentDiffs['caffeine_before'] = this.percentDifference(this.recentModel['caffeine_before'], this.personalModel['caffeine_before']);
    this.percentDiffs['caffeine_after'] = this.percentDifference(this.recentModel['caffeine_after'], this.personalModel['caffeine_after']);
    console.log(this.percentDiffs);
  
    this.percentDiffs.sort()
  }
//either change database format since 1 personal model and raw data OR add date field to personal model since i need most recent

  
}
