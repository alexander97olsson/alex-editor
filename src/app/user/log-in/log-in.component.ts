import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../token';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  url = `https://ramverk-editor-alos17.azurewebsites.net/auth/login`;
  public token = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClickPrint() {
    fetch('https://ramverk-editor-alos17.azurewebsites.net/graphql', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
      body: JSON.stringify({ query: "{ users { email } }" })
      })
      .then(r => r.json())
      .then(data => console.log('data returned:', data));
  }

  OnSubmit(Email, password){
    var user = {
      email: Email,
      password: password
    };
    
    fetch(this.url, {
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(function (response) {
      return response.json();
    }).then(function(data) {
      console.log(data.data.token)
      globals.token = data.data.token
      globals.userLogged = Email;
    }).then(() => this.router.navigate(['/editor']))
  }
}
