import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../token';

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
