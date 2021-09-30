import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  url = `https://ramverk-editor-alos17.azurewebsites.net/auth/register`;

  public user = {
    Password: '',
    Email: '',
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  OnSubmit(data){
    console.log(this.user.Email);
    var user = {
      email: this.user.Email,
      password: this.user.Password
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
      console.log(data)
    }).then(() => this.router.navigate(['/login']))
  }
}
