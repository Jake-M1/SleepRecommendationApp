import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PersonalModelData } from 'src/app/data/personalModel-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserData } from 'src/app/data/user-data';
import { SleepData } from 'src/app/data/sleep-data';
import {formatDate} from '@angular/common';
import { ShareRecService } from 'src/app/services/share-rec.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs:string[] = [];
  recValues:string[] = [];
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

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService, private shareRec: ShareRecService) {}

  ngOnInit(): void {

    this.recs = this.shareRec.getRecsRanges();

  }
}
