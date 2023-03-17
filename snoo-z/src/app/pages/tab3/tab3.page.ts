import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserData } from 'src/app/data/user-data';
import { SleepData } from 'src/app/data/sleep-data';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs:string[] = [];
  showing: boolean = true;
  recentDate = new Date(2000, 0, 1);
  date = new Date();
  sortedModel:(string | number)[][] = [[]];
  personalFlag = 0;
  recentFlag = 0;
  count = 0;

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
    //console.log("from recent:", newValue, "from old", oldValue);
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

  timeToSeconds(time: string)
  {
    var totalSeconds = 0;
    totalSeconds += parseInt(time.slice(0, 2)) * 3600;
    totalSeconds += parseInt(time.slice(3, 5)) * 60;
    totalSeconds += parseInt(time.slice(6, 8));
    return totalSeconds;
  }

  secondsToTime(secondsTotal: number)
  {
    var hours = secondsTotal / 3600;
    var hoursRounded = Math.floor(hours);
    var minutes = (hours - hoursRounded) * 60;
    var minutesRounded = Math.floor(minutes);
    var seconds = Math.floor((minutes - minutesRounded) * 60);

    if (hoursRounded >= 10)
    {
      var hourStr = hoursRounded.toString();
    }
    else
    {
      var hourStr = "0" + hoursRounded.toString();
    }
    if (minutesRounded >= 10)
    {
      var minuteStr = minutesRounded.toString();
    }
    else
    {
      var minuteStr = "0" + minutesRounded.toString();
    }
    if (seconds >= 10)
    {
      var secondStr = seconds.toString();
    }
    else
    {
      var secondStr = "0" + seconds.toString();
    }

    return hourStr + ":" + minuteStr + ":" + secondStr;
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

    //console.log("model: ", " ", this.personalModel);

    
    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.sleepdata = res.map((e:any) =>{
        return new SleepData(e.payload.doc.data());
      })
      this.sleepdata?.forEach((data) =>{
        this.date = this.createDate(data['date']);
        if(this.recentDate == null){
          //console.log("RECENT MODEL UPDATED");
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
          this.percentDiffs['bedtime_start'] = this.percentDifference(this.timeToSeconds(this.recentModel.get('bedtime_start')), this.timeToSeconds(this.personalModel['bedtime_start']));
          this.percentDiffs['bedtime_end'] = this.percentDifference(this.timeToSeconds(this.recentModel.get('bedtime_end')), this.timeToSeconds(this.personalModel['bedtime_end']));
          this.percentDiffs['steps'] = this.percentDifference(this.recentModel.get('steps'), this.personalModel['steps']);
          this.percentDiffs['alcohol'] = this.percentDifference(this.recentModel.get('alcohol'), this.personalModel['alcohol']);
          this.percentDiffs['water'] = this.percentDifference(this.recentModel.get('water'), this.personalModel['water']);
          this.percentDiffs['sugar'] = this.percentDifference(this.recentModel.get('sugar'), this.personalModel['sugar']);
          this.percentDiffs['caffeine'] = this.percentDifference(this.recentModel.get('caffeine'), this.personalModel['caffeine']);
          this.percentDiffs['caffeine_before'] = this.percentDifference(this.recentModel.get('caffeine_before'), this.personalModel['caffeine_before']);
          this.percentDiffs['caffeine_after'] = this.percentDifference(this.recentModel.get('caffeine_after'), this.personalModel['caffeine_after']);
          this.sortedModel = Object.entries(this.percentDiffs).sort((a,b) => a[1] - b[1]);
        }else if(this.date > this.recentDate){
          //console.log("RECENT MODEL UPDATED");
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
          this.percentDiffs['bedtime_start'] = this.percentDifference(this.timeToSeconds(this.recentModel.get('bedtime_start')), this.timeToSeconds(this.personalModel['bedtime_start']));
          this.percentDiffs['bedtime_end'] = this.percentDifference(this.timeToSeconds(this.recentModel.get('bedtime_end')), this.timeToSeconds(this.personalModel['bedtime_end']));
          this.percentDiffs['steps'] = this.percentDifference(this.recentModel.get('steps'), this.personalModel['steps']);
          this.percentDiffs['alcohol'] = this.percentDifference(this.recentModel.get('alcohol'), this.personalModel['alcohol']);
          this.percentDiffs['water'] = this.percentDifference(this.recentModel.get('water'), this.personalModel['water']);
          this.percentDiffs['sugar'] = this.percentDifference(this.recentModel.get('sugar'), this.personalModel['sugar']);
          this.percentDiffs['caffeine'] = this.percentDifference(this.recentModel.get('caffeine'), this.personalModel['caffeine']);
          this.percentDiffs['caffeine_before'] = this.percentDifference(this.recentModel.get('caffeine_before'), this.personalModel['caffeine_before']);
          this.percentDiffs['caffeine_after'] = this.percentDifference(this.recentModel.get('caffeine_after'), this.personalModel['caffeine_after']);
          this.sortedModel = Object.entries(this.percentDiffs).sort((a,b) => a[1] - b[1]);
          // console.log(this.percentDiffs);
          // console.log("sortedmodel", this.sortedModel);
        }

      });
      console.log("sortedmodel", this.sortedModel);
      for(let i = 9; i >= 0; i--){
        if(this.count == 5){
          break;
        }
        if(this.sortedModel[i][0] == "caffeine"){
          if(this.recentModel.get('caffeine') > this.personalModel['caffeine']){
            this.recs.push("Reduce caffeine intake to around " + this.personalModel['caffeine'] + "mg.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_after"){
          if(this.recentModel.get('caffeine_after') > this.personalModel['caffeine_after']){
            this.recs.push("Reduce caffeine intake after 6pm to around " + this.personalModel['caffeine_after'] + "mg.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_before"){
          if(this.recentModel.get('caffeine_before') > this.personalModel['caffeine_before']){
            this.recs.push("Reduce caffeine intake before 6pm to around " + this.personalModel['caffeine_before'] + "mg.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "alcohol"){
          if(this.recentModel.get('alcohol') > this.personalModel['alcohol']){
            this.recs.push("Reduce alcohol consumption to around " + this.personalModel['alcohol'] + " grams.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "steps"){
          if(this.recentModel.get('steps') > this.personalModel['steps']){
            this.recs.push("Reduce your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.count++;
          }
          if(this.recentModel.get('steps') < this.personalModel['steps']){
            this.recs.push("Increase your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "bedtime_end"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) > this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up earlier at around " + this.personalModel['bedtime_end'] + " hours.");
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) < this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up later at around " + this.personalModel['bedtime_end'] + " hours.");
          }
        }
        if(this.sortedModel[i][0] == "water"){
          if(this.recentModel.get('water') > this.personalModel['water']){
            this.recs.push("Drink less water before bed.");
            this.count++;
          }
          if(this.recentModel.get('water') < this.personalModel['water']){
            this.recs.push("Increase your water intake to around " + this.personalModel['water'] + " grams.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "sugar"){
          if(this.recentModel.get('sugar') > this.personalModel['sugar']){
            this.recs.push("Reduce your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.count++;
          }
          if(this.recentModel.get('sugar') < this.personalModel['sugar']){
            this.recs.push("Increase your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "bedtime_start"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) > this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Sleep earlier. Try to sleep at around " + this.personalModel['bedtime_start'] + " hours.");
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) < this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Try sleeping later at around " + this.personalModel['bedtime_start'] + " hours.");
          }
        }
      }

    });
    // if(this.recentFlag == 1 && this.personalFlag == 1){
    console.log("recent model", this.recentModel);
    console.log("percent difference model", this.percentDiffs);
    console.log("personal model: ", " ", this.personalModel);
    
    //}
  }
}
