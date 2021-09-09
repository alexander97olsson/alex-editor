import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alex-editor-program';
  public Editor = ClassicEditor;
  public objectDocs = {} as any;
  public objectDocs123 = {} as any;
  public nameArray: string[] = [];
  public selected = "";
  public consoleMessage = '';
  public model = {
    editorDataTitle: '<p>Hello, world!</p>',
    editorDataText: '<p>Hello, world!</p>'
  };
  
  constructor (private renderer: Renderer2) {
    this.onClickGetAll();
  }

  mainText = new FormControl('');
  titleText = new FormControl('');

  updateMainText() {
    this.mainText.setValue(this.model.editorDataText);
  }

  updateTitleText() {
    this.titleText.setValue(this.model.editorDataTitle);
  }
  public onChangeTitle(data) {
    this.model.editorDataTitle = data.target.value;
    console.log(this.model.editorDataTitle);
  }
  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.consoleMessage = data;
    this.model.editorDataText = data;
    console.log(this.titleText.value);
  }

  async onClickLoad() {
    const middleHand = await this.getAll();
    this.model.editorDataText = "";
    for (let i = 0; i < middleHand.data.msg.length; i++) {
      if(this.selected == middleHand.data.msg[i]._id) {
        this.model.editorDataText = middleHand.data.msg[i].maintext;
        this.model.editorDataTitle = middleHand.data.msg[i].title
      }
    }
    this.updateMainText();
    this.updateTitleText();
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
    this.objectDocs = await this.getAll();
    this.objectDocs123 = this.objectDocs.data;
    this.updateMainText();
    this.updateTitleText();
  }

  onClickSubmit(data) {
    this.updateMainText();
    this.updateTitleText();
    console.log("title is : " + data.titleText);
    console.log("object is : " + data);
    var delivery = {
      title: this.model.editorDataTitle,
      maintext: this.model.editorDataText
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

 async updateSpecific() {
  const middleHand = await this.getAll();

   for (let i = 0; i < middleHand.data.msg.length; i++) {
    if(this.selected == middleHand.data.msg[i]._id) {
      var delivery = {
        __id: this.selected,
        title: this.model.editorDataTitle,
        maintext: this.model.editorDataText
      };
      fetch("https://ramverk-editor-alos17.azurewebsites.net/data", {
        body: JSON.stringify(delivery),
        headers: {
          'content-type': 'application/json'
        },
        method: 'PUT'
        }).then(function (response) {
          return response.json();
        }).then(function(data) {
          console.log(data)
        })
     }
    }
   }
}
