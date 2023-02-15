import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  chartTitles = ["Sleep Quality", "Sleep Amount", "Activity", "Caffeine Intake"];
  showing: boolean = true;
  constructor() {}

}
