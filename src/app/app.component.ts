import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alex-editor-program';
  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  constructor(private router: Router) { }
  consoleMessage = '';
  errorMessage = "";
  name = new FormControl('');
  myGroup = new FormGroup({
    firstName: new FormControl()
 });
  updateName() {
    this.name.setValue(this.model.editorData);
  }
  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.consoleMessage = data;
    this.model.editorData = data;
  }

  public async getAll() {
    try {
      const response = await fetch(`https://ramverk-editor-alos17.azurewebsites.net/data`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET'
      });
      const testar = await response.json();
      return testar;
      } catch (error) {
        console.error(error);
    }
  }
  async onClickGetAll() {
    const exam = await this.getAll();
    console.log(exam.data.msg[0].title);
    this.model.editorData = exam.data.msg[2].maintext;
    console.log(this.model.editorData);
    this.updateName();
    this.router.navigate(['/']);
  }

  onClickSubmit(data) {
    console.log("title is : " + data.title);
    var delivery = {
      title: data.title,
      maintext: this.consoleMessage
    };
    fetch(`https://ramverk-editor-alos17.azurewebsites.net/data`, {
      body: JSON.stringify(delivery),
      headers: {
          'content-type': 'application/json'
      },
      method: 'POST'
    }).then(function (response) {
      return response.json();
    }).then(function(data) {
      console.log(data)
    })
 }
}
