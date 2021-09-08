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
  public objectDocs = [];
  public model = {
    editorDataTitle: '<p>Hello, world!</p>',
    editorDataText: '<p>Hello, world!</p>'
  };
  constructor(private router: Router) { }

  consoleMessage = '';

  mainText = new FormControl('');
  titleText = new FormControl('');

  updateMainText() {
    this.mainText.setValue(this.model.editorDataText);
  }

  updateTitleText() {
    this.titleText.setValue(this.model.editorDataTitle);
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.consoleMessage = data;
    this.model.editorDataText = data;
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
    const objectDocs = await this.getAll();
    console.log(objectDocs.data.msg[0].title);
    console.log(objectDocs.data.msg[0]._id);
    for (let i = 0; i < objectDocs.data.msg.length; i++) {
      console.log(objectDocs.data.msg[i].maintext);
      this.model.editorDataText += objectDocs.data.msg[i].maintext;
    }
    this.model.editorDataTitle = objectDocs.data.msg[0].title;
    this.updateMainText();
    this.updateTitleText();
    this.router.navigate(['/']);
  }

  onClickSubmit(data) {
    console.log("title is : " + data.titleText);
    var delivery = {
      title: data.titleText,
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
