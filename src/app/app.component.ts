import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
  url = `https://ramverk-editor-alos17.azurewebsites.net/data`;
  title = 'app-title-test';

  getTest(arg1: number, arg2: number) {
    return arg1 + arg2;
  }
}
