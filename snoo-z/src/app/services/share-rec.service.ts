import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { SleepData } from 'src/app/data/sleep-data';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ShareRecService {

  private recentModel = new Map();
  //private percentDiffs = new Map();
  //private personalModel: Map<any, any> = new Map<any, any>();
  private sortedModel:(string | number)[][] = [[]];
  private count = 0;
  private recValues:string[] = [];
  private model:PersonalModelData[] | undefined;
  private sleepdata:SleepData[] | undefined;
  private recentDate = new Date(2000, 0, 1);
  private date = new Date();
  private personalFlag = 0;
  private recs:string[] = [];
  private recomendRange: Map<any, any> = new Map<string, Array<number | string>>();
  private prefBedTime: string = "22:00:00";
  private prefWakeTime: string = "6:00:00";
  private recsRanges:string[] = [];

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

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {

    this.firestore.collection('/personal_model').snapshotChanges().subscribe(res =>{
      this.model = res.map((e:any) =>{
        return new PersonalModelData(e.payload.doc.data());
      })
      this.model?.forEach((data) => {
        this.personalModel = new PersonalModelData(data);
      })
      this.personalFlag = 1;
    })

    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.sleepdata = res.map((e:any) =>{
        return new SleepData(e.payload.doc.data());
      })
      this.sleepdata?.forEach((data) =>{
        this.date = this.createDate(data['date']);
        if(this.recentDate == null){
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
        }

      });

      for(let i = 9; i >= 0; i--){
        if(this.sortedModel[i][0] == "bedtime_end"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) > this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up earlier at around " + this.personalModel['bedtime_end'] + " hours.");
            this.recValues.push('bedtime_end');
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) < this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up later at around " + this.personalModel['bedtime_end'] + " hours.");
            this.recValues.push('bedtime_end');
          }
        }
        if(this.sortedModel[i][0] == "bedtime_start"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) > this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Sleep earlier. Try to sleep at around " + this.personalModel['bedtime_start'] + " hours.");
            this.recValues.push('bedtime_start');
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) < this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Try sleeping later at around " + this.personalModel['bedtime_start'] + " hours.");
            this.recValues.push('bedtime_start');
          }
        }
      }

      for(let i = 9; i >= 0; i--){
        if(this.count == 3){
          break;
        }
        if(this.sortedModel[i][0] == "caffeine"){
          if(this.recentModel.get('caffeine') > this.personalModel['caffeine']){
            this.recs.push("Reduce caffeine intake to around " + this.personalModel['caffeine'] + "mg.");
            this.recValues.push('caffeine');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_after"){
          if(this.recentModel.get('caffeine_after') > this.personalModel['caffeine_after']){
            this.recs.push("Reduce caffeine intake after 6pm to around " + this.personalModel['caffeine_after'] + "mg.");
            this.recValues.push('caffeine_after');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_before"){
          if(this.recentModel.get('caffeine_before') > this.personalModel['caffeine_before']){
            this.recs.push("Reduce caffeine intake before 6pm to around " + this.personalModel['caffeine_before'] + "mg.");
            this.recValues.push('caffeine_before');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "alcohol"){
          if(this.recentModel.get('alcohol') > this.personalModel['alcohol']){
            this.recs.push("Reduce alcohol consumption to around " + this.personalModel['alcohol'] + " grams.");
            this.recValues.push('alcohol');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "steps"){
          if(this.recentModel.get('steps') > this.personalModel['steps']){
            this.recs.push("Reduce your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.recValues.push('steps');
            this.count++;
          }
          if(this.recentModel.get('steps') < this.personalModel['steps']){
            this.recs.push("Increase your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.recValues.push('steps');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "water"){
          if(this.recentModel.get('water') > this.personalModel['water']){
            this.recs.push("Drink less water before bed.");
            this.recValues.push('water');
            this.count++;
          }
          if(this.recentModel.get('water') < this.personalModel['water']){
            this.recs.push("Increase your water intake to around " + this.personalModel['water'] + " grams.");
            this.recValues.push('water');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "sugar"){
          if(this.recentModel.get('sugar') > this.personalModel['sugar']){
            this.recs.push("Reduce your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.recValues.push('sugar');
            this.count++;
          }
          if(this.recentModel.get('sugar') < this.personalModel['sugar']){
            this.recs.push("Increase your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.recValues.push('sugar');
            this.count++;
          }
        }
      }

      this.generateRecommendRanges();
      this.generateRecRangeMessages();

    });
  }




  getRecVals()
  {
    return this.recValues;
  }

  getRecentModel()
  {
    return this.recentModel;
  }

  getPersonalModel()
  {
    return this.personalModel;
  }

  getPercentDiffs()
  {
    return this.percentDiffs;
  }

  getRecs()
  {
    return this.recs;
  }

  getRecentDate()
  {
    return this.recentDate;
  }

  getRecsRanges()
  {
    return this.recsRanges;
  }



  setPrefBedTime(newTime: string)
  {
    this.prefBedTime = newTime;
    this.generateRecommendRanges();
    this.generateRecRangeMessages();
  }

  setPrefWakeTime(newTime: string)
  {
    this.prefWakeTime = newTime;
    this.generateRecommendRanges();
    this.generateRecRangeMessages();
  }




  percentDifference(newValue: number, oldValue: number): number {
    if(oldValue == newValue){
      return 0;
    }

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

   generateRecommendRanges()
   {
    this.recomendRange.clear();
    var factor;
    var recAmount;
    var recAmountMin;
    var recAmountMax;
    for (let i = 0; i < this.recs.length; i++)
    {
      factor = this.recValues[i];
      if (factor === "bedtime_start")
      {
        recAmount = Math.floor((this.timeToSeconds(this.recentModel.get(factor)) + this.timeToSeconds(this.personalModel[factor])*2 + this.timeToSeconds(this.prefBedTime)) / 4);
        recAmountMin = this.secondsToTime(recAmount - 1800);
        recAmountMax = this.secondsToTime(recAmount + 1800);
        recAmount = this.secondsToTime(recAmount);
      }
      else if (factor === "bedtime_end")
      {
        recAmount = Math.floor((this.timeToSeconds(this.recentModel.get(factor)) + (this.timeToSeconds(this.personalModel[factor])*2) + this.timeToSeconds(this.prefWakeTime)) / 4);
        recAmountMin = this.secondsToTime(recAmount - 1800);
        recAmountMax = this.secondsToTime(recAmount + 1800);
        recAmount = this.secondsToTime(recAmount);
      }
      else if (factor === "total_sleep_duration")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 1800;
        recAmountMax = recAmount + 1800;
      }
      else if (factor === "awake_time")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 100;
        recAmountMax = recAmount + 100;
      }
      else if (factor === "steps")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 250;
        recAmountMax = recAmount + 250;
      }
      else if (factor === "alcohol")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 1;
        recAmountMax = recAmount + 1;
      }
      else if (factor === "water")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 200;
        recAmountMax = recAmount + 200;
      }
      else if (factor === "sugar")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 100;
        recAmountMax = recAmount + 100;
      }
      else if (factor === "caffeine")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 10;
        recAmountMax = recAmount + 10;
      }
      else if (factor === "caffeine_before")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 10;
        recAmountMax = recAmount + 10;
      }
      else if (factor === "caffeine_after")
      {
        recAmount = (this.recentModel.get(factor) + this.personalModel[factor]) / 2;
        recAmountMin = recAmount - 5;
        recAmountMax = recAmount + 5;
      }

      this.recomendRange.set(factor, [recAmountMin, recAmountMax]);
    }
  }

  generateRecRangeMessages()
  {
    while (this.recsRanges.length > 0)
    {
      this.recsRanges.pop();
    }

    for (let i = 0; i < this.recValues.length; i++)
    {

      if(this.recValues[i] == "caffeine"){
        if(this.recentModel.get('caffeine') > this.personalModel['caffeine']){
          this.recsRanges.push("Reduce caffeine intake to around " + this.recomendRange.get('caffeine')[0] + " to " + this.recomendRange.get('caffeine')[1] + " mg.");
        }
      }
      if(this.recValues[i] == "caffeine_after"){
        if(this.recentModel.get('caffeine_after') > this.personalModel['caffeine_after']){
          this.recsRanges.push("Reduce caffeine intake after 6pm to around " + this.recomendRange.get('caffeine_after')[0] + " to " + this.recomendRange.get('caffeine_after')[1] + "mg.");
        }
      }
      if(this.recValues[i] == "caffeine_before"){
        if(this.recentModel.get('caffeine_before') > this.personalModel['caffeine_before']){
          this.recsRanges.push("Reduce caffeine intake before 6pm to around " + this.recomendRange.get('caffeine_before')[0] + " to " + this.recomendRange.get('caffeine_before')[1] + "mg.");
        }
      }
      if(this.recValues[i] == "alcohol"){
        if(this.recentModel.get('alcohol') > this.personalModel['alcohol']){
          this.recsRanges.push("Reduce alcohol consumption to around " + this.recomendRange.get('alcohol')[0] + " to " + this.recomendRange.get('alcohol')[1] + " grams.");
        }
      }
      if(this.recValues[i] == "steps"){
        if(this.recentModel.get('steps') > this.personalModel['steps']){
          this.recsRanges.push("Reduce your daily steps to around " + this.recomendRange.get('steps')[0] + " to " + this.recomendRange.get('steps')[1] + " steps.");
        }
        if(this.recentModel.get('steps') < this.personalModel['steps']){
          this.recsRanges.push("Increase your daily steps to around " + this.recomendRange.get('steps')[0] + " to " + this.recomendRange.get('steps')[1] + " steps.");
        }
      }
      if(this.recValues[i] == "bedtime_end"){
        if(this.timeToSeconds(this.recentModel.get('bedtime_end')) > this.timeToSeconds(this.personalModel['bedtime_end'])){
          this.recsRanges.push("Try waking up earlier at around " + this.recomendRange.get('bedtime_end')[0] + " to " + this.recomendRange.get('bedtime_end')[1] + " hours.");
        }
        if(this.timeToSeconds(this.recentModel.get('bedtime_end')) < this.timeToSeconds(this.personalModel['bedtime_end'])){
          this.recsRanges.push("Try waking up later at around " + this.recomendRange.get('bedtime_end')[0] + " to " + this.recomendRange.get('bedtime_end')[1] + " hours.");
        }
      }
      if(this.recValues[i] == "water"){
        if(this.recentModel.get('water') > this.personalModel['water']){
          this.recsRanges.push("Drink less water before bed.");
        }
        if(this.recentModel.get('water') < this.personalModel['water']){
          this.recsRanges.push("Increase your water intake to around " + this.recomendRange.get('water')[0] + " to " + this.recomendRange.get('water')[1] + " grams.");
        }
      }
      if(this.recValues[i] == "sugar"){
        if(this.recentModel.get('sugar') > this.personalModel['sugar']){
          this.recsRanges.push("Reduce your sugar intake to around " + this.recomendRange.get('sugar')[0] + " to " + this.recomendRange.get('sugar')[1] + " grams.");
        }
        if(this.recentModel.get('sugar') < this.personalModel['sugar']){
          this.recsRanges.push("Increase your sugar intake to around " + this.recomendRange.get('sugar')[0] + " to " + this.recomendRange.get('sugar')[1] + " grams.");
        }
      }
      if(this.recValues[i] == "bedtime_start"){
        if(this.timeToSeconds(this.recentModel.get('bedtime_start')) > this.timeToSeconds(this.personalModel['bedtime_start'])){
          this.recsRanges.push("Sleep earlier. Try to sleep at around " + this.recomendRange.get('bedtime_start')[0] + " to " + this.recomendRange.get('bedtime_start')[1] + " hours.");
        }
        if(this.timeToSeconds(this.recentModel.get('bedtime_start')) < this.timeToSeconds(this.personalModel['bedtime_start'])){
          this.recsRanges.push("Try sleeping later at around " + this.recomendRange.get('bedtime_start')[0] + " to " + this.recomendRange.get('bedtime_start')[1] + " hours.");
        }
      }
    }

  }


  generateNewRecommendations(newRecentDateStr: string)
  {
    this.firestore.collection('/personal_model').snapshotChanges().subscribe(res =>{
      this.model = res.map((e:any) =>{
        return new PersonalModelData(e.payload.doc.data());
      })
      this.model?.forEach((data) => {
        this.personalModel = new PersonalModelData(data);
      })
      this.personalFlag = 1;
    })

    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.sleepdata = res.map((e:any) =>{
        return new SleepData(e.payload.doc.data());
      })
      this.sleepdata?.forEach((data) =>{
        this.date = this.createDate(data['date']);

        if(this.date.toISOString().slice(0, 10) === newRecentDateStr){
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
        }

      });

      while (this.recs.length > 0)
      {
        this.recs.pop();
      }
      while (this.recValues.length > 0)
      {
        this.recValues.pop();
      }
      this.count = 0;

      for(let i = 9; i >= 0; i--){
        if(this.sortedModel[i][0] == "bedtime_end"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) > this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up earlier at around " + this.personalModel['bedtime_end'] + " hours.");
            this.recValues.push('bedtime_end');
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_end')) < this.timeToSeconds(this.personalModel['bedtime_end'])){
            this.recs.push("Try waking up later at around " + this.personalModel['bedtime_end'] + " hours.");
            this.recValues.push('bedtime_end');
          }
        }
        if(this.sortedModel[i][0] == "bedtime_start"){
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) > this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Sleep earlier. Try to sleep at around " + this.personalModel['bedtime_start'] + " hours.");
            this.recValues.push('bedtime_start');
          }
          if(this.timeToSeconds(this.recentModel.get('bedtime_start')) < this.timeToSeconds(this.personalModel['bedtime_start'])){
            this.recs.push("Try sleeping later at around " + this.personalModel['bedtime_start'] + " hours.");
            this.recValues.push('bedtime_start');
          }
        }
      }

      for(let i = 9; i >= 0; i--){
        if(this.count == 3){
          break;
        }
        if(this.sortedModel[i][0] == "caffeine"){
          if(this.recentModel.get('caffeine') > this.personalModel['caffeine']){
            this.recs.push("Reduce caffeine intake to around " + this.personalModel['caffeine'] + "mg.");
            this.recValues.push('caffeine');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_after"){
          if(this.recentModel.get('caffeine_after') > this.personalModel['caffeine_after']){
            this.recs.push("Reduce caffeine intake after 6pm to around " + this.personalModel['caffeine_after'] + "mg.");
            this.recValues.push('caffeine_after');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "caffeine_before"){
          if(this.recentModel.get('caffeine_before') > this.personalModel['caffeine_before']){
            this.recs.push("Reduce caffeine intake before 6pm to around " + this.personalModel['caffeine_before'] + "mg.");
            this.recValues.push('caffeine_before');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "alcohol"){
          if(this.recentModel.get('alcohol') > this.personalModel['alcohol']){
            this.recs.push("Reduce alcohol consumption to around " + this.personalModel['alcohol'] + " grams.");
            this.recValues.push('alcohol');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "steps"){
          if(this.recentModel.get('steps') > this.personalModel['steps']){
            this.recs.push("Reduce your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.recValues.push('steps');
            this.count++;
          }
          if(this.recentModel.get('steps') < this.personalModel['steps']){
            this.recs.push("Increase your daily steps to around " + this.personalModel['steps'] + " steps.");
            this.recValues.push('steps');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "water"){
          if(this.recentModel.get('water') > this.personalModel['water']){
            this.recs.push("Drink less water before bed.");
            this.recValues.push('water');
            this.count++;
          }
          if(this.recentModel.get('water') < this.personalModel['water']){
            this.recs.push("Increase your water intake to around " + this.personalModel['water'] + " grams.");
            this.recValues.push('water');
            this.count++;
          }
        }
        if(this.sortedModel[i][0] == "sugar"){
          if(this.recentModel.get('sugar') > this.personalModel['sugar']){
            this.recs.push("Reduce your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.recValues.push('sugar');
            this.count++;
          }
          if(this.recentModel.get('sugar') < this.personalModel['sugar']){
            this.recs.push("Increase your sugar intake to around " + this.personalModel['sugar'] + " grams.");
            this.recValues.push('sugar');
            this.count++;
          }
        }
      }

      this.generateRecommendRanges();
      this.generateRecRangeMessages();
    });
  }
}
