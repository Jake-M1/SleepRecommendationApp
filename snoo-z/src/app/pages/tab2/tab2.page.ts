import { Component, OnInit, ViewChild } from '@angular/core';
import 'chartjs-adapter-moment';
import { Chart } from 'chart.js/auto';
import {formatDate} from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserData } from 'src/app/data/user-data';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  @ViewChild('sleepQualityCanvas') sleepQualityCanvas: any;
  @ViewChild('sleepDurationCanvas') sleepDurationCanvas: any;
  @ViewChild('bedtimeStartCanvas') bedtimeStartCanvas: any;
  @ViewChild('bedtimeEndCanvas') bedtimeEndCanvas: any;
  @ViewChild('caffineCanvas') caffineCanvas: any;

  sleepQualityChart: any;
  sleepDurationChart: any;
  bedtimeStartChart: any;
  bedtimeEndChart: any;
  caffineChart: any;
  colorArray: any;

  private sleepQualityChartCreated: boolean = false;
  private sleepDurationChartCreated: boolean = false;
  private bedtimeStartChartCreated: boolean = false;
  private bedtimeEndChartCreated: boolean = false;
  private caffineChartCreated: boolean = false;

  private sampleData = new Map();
  public myDate1: any;
  private currentDate: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  private user:UserData[] | undefined;
  
  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {
    
    /*
    this.sampleData.set("2023-02-15", ["83", "23670", "2023-02-14T22:51:07-07:00", "2023-02-15T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-16", ["83", "23670", "2023-02-15T22:51:07-07:00", "2023-02-16T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-17", ["83", "23670", "2023-02-16T22:51:07-07:00", "2023-02-17T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-18", ["83", "23670", "2023-02-17T22:51:07-07:00", "2023-02-18T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-19", ["83", "23670", "2023-02-18T22:51:07-07:00", "2023-02-19T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-20", ["83", "23670", "2023-02-19T22:51:07-07:00", "2023-02-20T06:00:07-07:00", "0"]);
    this.sampleData.set("2023-02-21", ["94", "29190", "2023-02-20T21:36:31-07:00", "2023-02-21T06:07:31-07:00", "1"]);
    */
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

  ionViewDidEnter()
  {
    this.createSleepQualityChart(7);
    this.createSleepDurationChart(7);
    this.createBedtimeStartChart(7);
    this.createBedtimeEndChart(7);
    this.createCaffineChart(7);
  }

  getDayLabels(d: number)
  {
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    var labels = [];

    while (d > 0)
    {
      var curDay = new Date();
      var addDay = new Date();
      addDay.setDate(curDay.getDate() - d + 1);
      labels.push(formatDate(addDay, 'yyyy-MM-dd', 'en'));
      d--;
    }

    return labels;
  }

  getDayData(labels: string[], index: number)
  {
    var data = [];

    for (let i = 0; i < labels.length; i++)
    {
      if (this.sampleData.has(labels[i]))
      {
        if (index == 2 || index == 3)
        {
          data.push(this.sampleData.get(labels[i])[index].slice(11, 16));
        }
        else
        {
          data.push(parseInt(this.sampleData.get(labels[i])[index]));
        }
      }
      else
      {
        if (index == 2 || index == 3)
        {
          data.push("00:00:00");
        }
        else
        {
          data.push(0);
        }
      }
    }

    return data;
  }

  createSleepQualityChart(days: number)
  {
    if (this.sleepQualityChartCreated)
    {
      this.sleepQualityChart.destroy();
    }

    var labelArray = this.getDayLabels(days);
    var dataArray = this.getDayData(labelArray, 0);

    this.sleepQualityChart = new Chart(this.sleepQualityCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelArray,
        datasets: [{
          label: 'Overall Sleep Score',
          data: dataArray,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    }
    });

    this.sleepQualityChartCreated = true;
  }

  createSleepDurationChart(days: number)
  {
    if (this.sleepDurationChartCreated)
    {
      this.sleepDurationChart.destroy();
    }

    var labelArray = this.getDayLabels(days);
    var dataArray = this.getDayData(labelArray, 1);

    this.sleepDurationChart = new Chart(this.sleepDurationCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelArray,
        datasets: [{
          label: 'Sleep Duration Time',
          data: dataArray,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
    });

    this.sleepDurationChartCreated = true;
  }

  createBedtimeStartChart(days: number)
  {
    if (this.bedtimeStartChartCreated)
    {
      this.bedtimeStartChart.destroy();
    }

    var labelArray = this.getDayLabels(days);
    var dataArray = this.getDayData(labelArray, 2);

    this.bedtimeStartChart = new Chart(this.bedtimeStartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelArray,
        datasets: [{
          label: 'Bedtime Start Time',
          data: dataArray,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
            y: {
                type: "time",
                time: {
                  parser: "hh:mm",
                  unit: 'hour'
                }
            }
        }
    }
    });

    this.bedtimeStartChartCreated = true;
  }

  createBedtimeEndChart(days: number)
  {
    if (this.bedtimeEndChartCreated)
    {
      this.bedtimeEndChart.destroy();
    }

    var labelArray = this.getDayLabels(days);
    var dataArray = this.getDayData(labelArray, 3);

    this.bedtimeEndChart = new Chart(this.bedtimeEndCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelArray,
        datasets: [{
          label: 'Bedtime End Time',
          data: dataArray,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
            y: {
                type: "time",
                time: {
                  parser: "hh:mm",
                  unit: 'hour'
                }
            }
        }
    }
    });

    this.bedtimeEndChartCreated = true;
  }

  createCaffineChart(days: number)
  {
    if (this.caffineChartCreated)
    {
      this.caffineChart.destroy();
    }

    var labelArray = this.getDayLabels(days);
    var dataArray = this.getDayData(labelArray, 4);

    this.caffineChart = new Chart(this.caffineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelArray,
        datasets: [{
          label: 'Caffine (mg)',
          data: dataArray,
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
            y: {
                min: 0,
            }
        }
    }
    });

    this.caffineChartCreated = true;
  }

  showWeek()
  {
    this.createSleepQualityChart(7);
    this.createSleepDurationChart(7);
    this.createBedtimeStartChart(7);
    this.createBedtimeEndChart(7);
    this.createCaffineChart(7);
  }

  showMonth()
  {
    this.createSleepQualityChart(30);
    this.createSleepDurationChart(30);
    this.createBedtimeStartChart(30);
    this.createBedtimeEndChart(30);
    this.createCaffineChart(30);
  }
}
