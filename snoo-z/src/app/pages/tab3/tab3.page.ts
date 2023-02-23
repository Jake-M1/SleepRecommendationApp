import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  recs = ["This is dummy data", "Sleep Earlier", "Sleep Later", "Stop caffeine intake"];
  showing: boolean = true;
  constructor() {}
  ngOnInit(): void {

  }

}
