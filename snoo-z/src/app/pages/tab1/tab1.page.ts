import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {formatDate} from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData } from 'src/app/data/user-data';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public myDate: any;
  private selectedDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  private sampleData = new Map();
  private user:UserData[] | undefined;
  
  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {
    //this.sampleData.set("2023-02-20", ["83", "23670", "2023-02-19T22:51:07-07:00", "2023-02-20T06:00:07-07:00", "0"]);
    //this.sampleData.set("2023-02-21", ["94", "29190", "2023-02-20T21:36:31-07:00", "2023-02-21T06:07:31-07:00", "1"]);
  }
  ngOnInit(): void {
    this.firestore.collection('/user').snapshotChanges().subscribe(res =>{
      this.user = res.map((e:any) =>{
           return new UserData(e.payload.doc.data());
      })
      this.user?.forEach((data) =>{
        this.sampleData.set(data['date'], [data['sleep_score'], data['total_sleep_duration'], data['bedtime_start'], data['bedtime_end'], 0]);
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

  logout() {
    //this.authService.logout();
  }
}
