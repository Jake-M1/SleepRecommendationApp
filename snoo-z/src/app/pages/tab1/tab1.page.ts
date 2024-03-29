import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {formatDate} from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SleepData } from 'src/app/data/sleep-data';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public myDate: any = new Date("2022-06-11T10:00:00").toISOString();
  private selectedDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  private sampleData = new Map();
  private sleepdata:SleepData[] | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.firestore.collection('/data').snapshotChanges().subscribe(res =>{
      this.sleepdata = res.map((e:any) =>{
           return new SleepData(e.payload.doc.data());
      })
      this.sleepdata?.forEach((data) =>{
        this.sampleData.set(data['date'], [data['sleep_score'], data['total_sleep_duration'], data['bedtime_start'], data['bedtime_end'], data['caffeine']]);
      });
    });

  }

  setDate()
  {
    this.selectedDate = this.parseDate(this.myDate);
  }

  displayDate()
  {
    console.log(this.selectedDate);
  }

  getDate()
  {
    return this.selectedDate;
  }

  parseDate(ionicDate: string)
  {
    return ionicDate.slice(0, 10);
  }

  displayDateData(date: string)
  {
    if (this.sampleData.has(date))
    {
      var data = this.sampleData.get(date)
      if (data[2].length > 5)
      {
        data[2] = data[2].slice(11, 16);
      }
      if (data[3].length > 5)
      {
        data[3] = data[3].slice(11, 16);
      }
      return data;
    }
    else
    {
      return ["N/A", "N/A", "N/A", "N/A", "N/A"]
    }
  }
}
