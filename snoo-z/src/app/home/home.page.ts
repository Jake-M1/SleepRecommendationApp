import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { PersonalModelData } from '../data/personalModel-data';
import { SleepData } from '../data/sleep-data';
import { UserData } from '../data/user-data';
import { AuthenticationService } from '../services/authentication.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {formatDate} from '@angular/common';
import { ShareRecService } from '../services/share-rec.service';


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

  public myDate: any = new Date(2022, 5, 11).toISOString();
  private selectedDateTime: string = this.convertToIonicDate(formatDate(new Date(), 'yyyy-MM-dd hh:mma', 'en'));

  private percentDiffs: Array<Array<string | number>> = [];
  private recentValues: Map<any, any> = new Map<string, number | string>();
  private idealValues: Map<any, any> = new Map<string, number | string>();
  //private recomendValues: Map<any, any> = new Map<string, Array<number | string>>();
  private recomendValues:string[] = [];
  private recFactors:string[] = [];

  public myPrefBedTime: any = new Date("2023-01-01T14:00:00").toISOString();
  public myPrefWakeTime: any = new Date("2023-01-01T22:00:00").toISOString();
  private prefBedTime: string = "22:00:00";
  private prefWakeTime: string = "6:00:00";

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService, private toastController: ToastController, private router: Router, private shareRec: ShareRecService) { }

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

    // TEMP Testing
    /*
    this.recentValues.set("total_sleep_duration", 29130);
    this.recentValues.set("awake_time", 2010.0);
    this.recentValues.set("bedtime_start", "22:00:51");
    this.recentValues.set("bedtime_end", "06:39:51");
    this.recentValues.set("steps", 11395);
    this.recentValues.set("alcohol", 28.1);
    this.recentValues.set("water", 2781.33);
    this.recentValues.set("sugar", 103.71);
    this.recentValues.set("caffeine", 182.77);
    this.recentValues.set("caffeine_before", 182.77);
    this.recentValues.set("caffeine_after", 0);

    this.percentDiffs[0] = ["bedtime_start", 0];
    this.percentDiffs[1] = ["bedtime_end", 0];
    this.percentDiffs[2] = ["sugar", 2.985];
    this.percentDiffs[3] = ["caffeine", 11.65];
    this.percentDiffs[4] = ["caffeine_before", 16.92];
    this.percentDiffs[5] = ["total_sleep_duration", 19.15];
    this.percentDiffs[6] = ["steps", 44.13];
    this.percentDiffs[7] = ["awake_time", 44.91];
    this.percentDiffs[8] = ["water", 84.15];
    this.percentDiffs[9] = ["caffeine_after", 85.58];
    this.percentDiffs[10] = ["alcohol", 100];

    this.idealValues.set("total_sleep_duration", 28918.86);
    this.idealValues.set("awake_time", 1404.85);
    this.idealValues.set("bedtime_start", "21:12:18");
    this.idealValues.set("bedtime_end", "05:37:41");
    this.idealValues.set("steps", 8676.46);
    this.idealValues.set("alcohol", 0.01);
    this.idealValues.set("water", 2781.33);
    this.idealValues.set("sugar", 2983.76);
    this.idealValues.set("caffeine", 334.47);
    this.idealValues.set("caffeine_before", 332.25);
    this.idealValues.set("caffeine_after", 2.22);
    */

    this.sendNotifications();
  }

  logout(){

    this.authService.logout();

  }

  async presentToastMoreSleep(position: 'top' | 'middle' | 'bottom', messageStr: string) {
    const toast = await this.toastController.create({
      message: messageStr,
      duration: 50000,
      position: position,
      buttons: [
        {
          text: 'More Info',
          role: 'info',
          handler: () => { this.router.navigate(['tab3']); }
        },
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });

    await toast.present();
  }

  setDate()
  {
    this.selectedDateTime = this.parseDate(this.myDate);
    this.shareRec.generateNewRecommendations(this.selectedDateTime.slice(0, 10));
    this.sendNotifications();
  }

  displayDate()
  {
    console.log(this.selectedDateTime);
  }

  getDate()
  {
    return this.selectedDateTime;
  }

  parseDate(ionicDate: string)
  {
    return ionicDate.slice(0, 16);
  }

  convertToIonicDate(date: string)
  {
    var dateTime = date.slice(0, 10);
    dateTime += "T";
    if (date.slice(16,18) === "PM")
    {
      let hour = parseInt(date.slice(11,13));
      hour += 12;
      dateTime += hour.toString();
    }
    else
    {
      dateTime += date.slice(11,13);
    }
    dateTime += date.slice(13,16);

    return dateTime;
  }

  sendNotifications()
  {
    this.recomendValues = this.shareRec.getRecsRanges();
    this.recFactors = this.shareRec.getRecVals();

    for (let i = 0; i < this.recomendValues.length; i++)
    {
      var hour = parseInt(this.selectedDateTime.slice(11,13));
      if (hour == 12) // Go to bed rec
      {
        if (this.recFactors[i] === "bedtime_start")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 17) // Wake up rec
      {
        if (this.recFactors[i] === "bedtime_end")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 16) // Sleep duration rec
      {
        if (this.recFactors[i] === "total_sleep_duration")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 18) // Awake time rec
      {
        if(this.recFactors[i] === "awake_time")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 10) // Steps rec
      {
        if (this.recFactors[i] === "steps")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 14) // Alcohol rec
      {
        if (this.recFactors[i] === "alcohol")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 11) // Water rec
      {
        if (this.recFactors[i] === "water")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 13) // Sugar rec
      {
        if (this.recFactors[i] === "sugar")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 12) // Caffeine rec
      {
        if (this.recFactors[i] === "caffeine")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 9) // Caffeine before 6 rec
      {
        if (this.recFactors[i] === "caffeine_before")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
      else if (hour == 18) // Caffeine after 6 rec
      {
        if (this.recFactors[i] === "caffeine_after")
        {
          this.presentToastMoreSleep("middle", this.recomendValues[i]);
        }
      }
    }
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

  timeToSeconds(time: string)
  {
    var totalSeconds = 0;
    totalSeconds += parseInt(time.slice(0, 2)) * 3600;
    totalSeconds += parseInt(time.slice(3, 5)) * 60;
    totalSeconds += parseInt(time.slice(6, 8));
    return totalSeconds;
  }

  setPrefBedTime()
  {
    this.prefBedTime = this.parseTime(this.myPrefBedTime);
    this.shareRec.setPrefBedTime(this.prefBedTime);
  }

  setPrefWakeTime()
  {
    this.prefWakeTime = this.parseTime(this.myPrefWakeTime);
    this.shareRec.setPrefWakeTime(this.prefWakeTime);
  }

  parseTime(ionicDate: string)
  {
    return ionicDate.slice(11, 19);
  }
}
