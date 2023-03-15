import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserData } from 'src/app/data/user-data';
import { SleepData } from 'src/app/data/sleep-data';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs = ["Reduce alchohol intake", 
    "Sleep Earlier", 
    "Sleep Later", 
    "Stop caffeine intake in the evening", 
    "Reduce caffeine intake during the day"];
  showing: boolean = true;
  recentDate = new Date(2000, 0, 1);
  date = new Date();
  sortedModel = {};
  personalFlag = 0;
  recentFlag = 0;

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
  recentModel = new Map();
  // recentModel = {
  //   total_sleep_duration : 30000,
  //   awake_time : 1000,
  //   bedtime_start : '21:12:18',
  //   bedtime_end : '05:37:41',
  //   steps : 7000,
  //   alcohol : 28.1,
  //   water : 2781.33,
  //   sugar : 200,
  //   caffeine : 300,
  //   caffeine_before : 200,
  //   caffeine_after : 100
  // }

  percentDiffs = {
    'total_sleep_duration': 0, 
    'awake_time': 1404.85, 
    'bedtime_start': 0, 
    'bedtime_end': 0, 
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
  private sleepdata:SleepData[] | undefined;

  percentDifference(newValue: number, oldValue: number): number {
    if(oldValue == newValue){
      console.log("ALCH");
      return 0;
    }
    
    if(oldValue == 0 || newValue == 0){
      return 100;
    }
    console.log("from recent:", newValue, "from old", oldValue);
    const difference = Math.abs(newValue - oldValue);
    const percent = (difference / newValue) * 100;
    return percent;      


  }

  createDate(date:String){
   const dateArr = date.split("-");
   return new Date(Number(dateArr[0]), Number(dateArr[1])-1, Number(dateArr[2]));
  }

  convertDate(str:string){
    const date = new Date(str);
    return date.toLocaleTimeString('it-IT');
  }

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {}
  
  ngOnInit(): void {
    //console.log(this.model.awake_time);

    this.firestore.collection('/personal_model').snapshotChanges().subscribe(res =>{
      this.model = res.map((e:any) =>{
        return new PersonalModelData(e.payload.doc.data());
      })
      this.model?.forEach((data) => {
        this.personalModel = new PersonalModelData(data);
      })
      this.personalFlag = 1;
    })

    console.log("model: ", " ", this.personalModel);

    
    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.sleepdata = res.map((e:any) =>{
        return new SleepData(e.payload.doc.data());
      })
      this.sleepdata?.forEach((data) =>{
        this.date = this.createDate(data['date']);
        if(this.recentDate == null){
          console.log("RECENT MODEL UPDATED");
          this.recentDate = this.date;
          this.recentModel.set('total_sleep_duration', data['total_sleep_duration']);
          this.recentModel.set('awake_time', data['awake_time']);
          this.recentModel.set('bedtime_start', this.convertDate(data['bedtime_start']));
          this.recentModel.set('bedtime_end', this.convertDate(data['bedtime_end']));
          this.recentModel.set('steps', data['steps']);
          this.recentModel.set('alcohol', data['alcohol']);
          this.recentModel.set('water', data['water']);
          this.recentModel.set('sugar', data['sugar']);
          this.recentModel.set('caffeine', data['caffeine']);
          this.recentModel.set('caffeine_before', data['caffeine_before']);
          this.recentModel.set('caffeine_after', data['caffeine_after']);
          // this.recentModel.set('total_sleep_duration'] = data['total_sleep_duration'];
          // this.recentModel['awake_time'] = data['awake_time'];
          // this.recentModel['bedtime_start'] = this.convertDate(data['bedtime_start']);
          // this.recentModel['bedtime_end'] = this.convertDate(data['bedtime_end']);
          // this.recentModel['steps'] = data['steps'];
          // this.recentModel['alcohol'] = data['alcohol'];
          // this.recentModel['water'] = data['water'];
          // this.recentModel['sugar'] = data['sugar'];
          // this.recentModel['caffeine'] = data['caffeine'];
          // this.recentModel['caffeine_before'] = data['caffeine_before'];
          // this.recentModel['caffeine_after'] = data['caffeine_after'];
          this.percentDiffs['total_sleep_duration'] = this.percentDifference(this.recentModel.get('total_sleep_duration'), this.personalModel['total_sleep_duration']);
          this.percentDiffs['awake_time'] = this.percentDifference(this.recentModel.get('awake_time'), this.personalModel['awake_time']);
          //this.percentDiffs['bedtime_start'] = String(this.percentDifference(this.recentModel.get('bedtime_start'), this.personalModel['bedtime_start']));
          // this.percentDiffs['bedtime_end'] = String(this.percentDifference(this.recentModel.get('bedtime_end'), this.personalModel['bedtime_end']));
          this.percentDiffs['steps'] = this.percentDifference(this.recentModel.get('steps'), this.personalModel['steps']);
          this.percentDiffs['alcohol'] = this.percentDifference(this.recentModel.get('alcohol'), this.personalModel['alcohol']);
          this.percentDiffs['water'] = this.percentDifference(this.recentModel.get('water'), this.personalModel['water']);
          this.percentDiffs['sugar'] = this.percentDifference(this.recentModel.get('sugar'), this.personalModel['sugar']);
          this.percentDiffs['caffeine'] = this.percentDifference(this.recentModel.get('caffeine'), this.personalModel['caffeine']);
          this.percentDiffs['caffeine_before'] = this.percentDifference(this.recentModel.get('caffeine_before'), this.personalModel['caffeine_before']);
          this.percentDiffs['caffeine_after'] = this.percentDifference(this.recentModel.get('caffeine_after'), this.personalModel['caffeine_after']);
          this.sortedModel = Object.entries(this.percentDiffs).sort((a,b) => a[1] - b[1]);
        }else if(this.date > this.recentDate){
          console.log("RECENT MODEL UPDATED");
          this.recentDate = this.date;
          this.recentModel.set('total_sleep_duration', data['total_sleep_duration']);
          this.recentModel.set('awake_time', data['awake_time']);
          this.recentModel.set('bedtime_start', this.convertDate(data['bedtime_start']));
          this.recentModel.set('bedtime_end', this.convertDate(data['bedtime_end']));
          this.recentModel.set('steps', data['steps']);
          this.recentModel.set('alcohol', data['alcohol']);
          this.recentModel.set('water', data['water']);
          this.recentModel.set('sugar', data['sugar']);
          this.recentModel.set('caffeine', data['caffeine']);
          this.recentModel.set('caffeine_before', data['caffeine_before']);
          this.recentModel.set('caffeine_after', data['caffeine_after']);
          // this.recentModel['awake_time'] = data['awake_time'];
          // this.recentModel['bedtime_start'] = this.convertDate(data['bedtime_start']);
          // this.recentModel['bedtime_end'] = this.convertDate(data['bedtime_end']);
          // this.recentModel['steps'] = data['steps'];
          // this.recentModel['alcohol'] = data['alcohol'];
          // this.recentModel['water'] = data['water'];
          // this.recentModel['sugar'] = data['sugar'];
          // this.recentModel['caffeine'] = data['caffeine'];
          // this.recentModel['caffeine_before'] = data['caffeine_before'];
          // this.recentModel['caffeine_after'] = data['caffeine_after'];
          this.percentDiffs['total_sleep_duration'] = this.percentDifference(this.recentModel.get('total_sleep_duration'), this.personalModel['total_sleep_duration']);
          this.percentDiffs['awake_time'] = this.percentDifference(this.recentModel.get('awake_time'), this.personalModel['awake_time']);
          //this.percentDiffs['bedtime_start'] = String(this.percentDifference(this.recentModel.get('bedtime_start'), this.personalModel['bedtime_start']));
          // this.percentDiffs['bedtime_end'] = String(this.percentDifference(this.recentModel.get('bedtime_end'), this.personalModel['bedtime_end']));
          this.percentDiffs['steps'] = this.percentDifference(this.recentModel.get('steps'), this.personalModel['steps']);
          this.percentDiffs['alcohol'] = this.percentDifference(this.recentModel.get('alcohol'), this.personalModel['alcohol']);
          this.percentDiffs['water'] = this.percentDifference(this.recentModel.get('water'), this.personalModel['water']);
          this.percentDiffs['sugar'] = this.percentDifference(this.recentModel.get('sugar'), this.personalModel['sugar']);
          this.percentDiffs['caffeine'] = this.percentDifference(this.recentModel.get('caffeine'), this.personalModel['caffeine']);
          this.percentDiffs['caffeine_before'] = this.percentDifference(this.recentModel.get('caffeine_before'), this.personalModel['caffeine_before']);
          this.percentDiffs['caffeine_after'] = this.percentDifference(this.recentModel.get('caffeine_after'), this.personalModel['caffeine_after']);
          this.sortedModel = Object.entries(this.percentDiffs).sort((a,b) => a[1] - b[1]);
          console.log(this.percentDiffs);
          console.log("sortedmodel", this.sortedModel);
        }

      });
      this.recentFlag = 1;
    });
    // if(this.recentFlag == 1 && this.personalFlag == 1){
    console.log("sleep data", this.sleepdata);
    console.log("recent model", this.recentModel);
    console.log(this.recentModel.get('total_sleep_duration'), "size: ", this.recentModel.size);
    console.log("%", this.percentDiffs);

    console.log("new percentDiffs: ", this.percentDiffs);
  
    
    console.log("sortedmodel", this.sortedModel);
    //}
  }
//either change database format since 1 personal model and raw data OR add date field to personal model since i need most recent

  
}
