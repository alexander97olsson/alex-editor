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

  async queryFetch(query, variables) {
    return fetch('https://ramverk-editor-alos17.azurewebsites.net/graphql', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    }).then(res => res.json())
  }

  async addUser(emailInfo, passwordInfo) {
    return this.queryFetch(`
    mutation adduser($email: String!, $password: String!){
      addUser(email: $email, password: $password) {
        message
      }
    }
    `, { email: emailInfo, password: passwordInfo }).then(data => {
      console.log(data)
    }).then(() => this.router.navigate(['/login']))
  }

  async OnSubmit(data){
    console.log("User:" + this.user.Email + " created");
    await this.addUser(this.user.Email, this.user.Password);
  }
}
