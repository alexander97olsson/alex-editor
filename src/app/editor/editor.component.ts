import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor() { }
  url = `https://ramverk-editor-alos17.azurewebsites.net/data`;
  title = 'Alex-Editor';
  public Editor = ClassicEditor;
  public objectDocs = {} as any;
  public objectDocsComp = {} as any;
  public nameArray: string[] = [];
  public selected = "";
  public consoleMessage = '';
  public model = {
    editorDataTitle: '',
    editorDataText: ''
  };
  mainText = new FormControl('');
  titleText = new FormControl('');

  ngOnInit() {
    this.onClickGetAll();
  }

  updateMainText() {
    this.mainText.setValue(this.model.editorDataText);
  }

  updateTitleText() {
    this.titleText.setValue(this.model.editorDataTitle);
  }

  public onChangeTitle(data) {
    this.model.editorDataTitle = data.target.value;
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.consoleMessage = data;
    this.model.editorDataText = data;
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
      const response = await fetch(this.url, {
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
    this.objectDocsComp = this.objectDocs.data;
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
    fetch(this.url, {
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
      fetch(this.url, {
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
