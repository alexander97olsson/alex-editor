import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  
  url = `https://ramverk-editor-alos17.azurewebsites.net/data`;
  title = 'Alex-Editor';
  public Editor = ClassicEditor;
  public objectDocs = {} as any;
  public objectDocsComp = {} as any;
  public nameArray: string[] = [];
  public selected = "";
  public consoleMessage = '';
  public activeID = "";
  public editorData;
  public model = {
    editorDataTitle: '',
    editorDataText: ''
  };
  public data = {
    _id: "LÅNG OCH SLUMPAT",
    html: "Texten i html format från editorn"
  };
  mainText = new FormControl('');
  titleText = new FormControl('');

  ngOnInit() {
    this.onClickGetAll();
  }
  
  constructor(private socket: Socket) {
    //this.sendMessage("what up server");
  }
  
  startSocket(id) {
    this.socket.emit("joinRoom", id);
    this.socket.on("getDoc", (data) => {
        this.mainText.setValue(data);
        console.log(data);
    });
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
    this.editorData = editor;
    const tempData = editor.getData();
    this.consoleMessage = tempData;
    this.model.editorDataText = tempData;
    
    this.data._id = this.activeID;
    this.data.html = tempData
  }
  
  editDoc() {
    this.socket.emit("doc", this.data);
    this.socket.on("doc", (data) => {
      const viewFragment = this.editorData.data.processor.toView( data.html );
      const modelFragment = this.editorData.data.toModel( viewFragment );
      this.mainText.setValue("");
      this.editorData.model.insertContent( modelFragment );
    });
  }

  async onClickLoad() {
    const middleHand = await this.getAll();
    this.model.editorDataText = "";
    for (let i = 0; i < middleHand.data.msg.length; i++) {
      if(this.selected == middleHand.data.msg[i]._id) {
        this.model.editorDataText = middleHand.data.msg[i].maintext;
        this.model.editorDataTitle = middleHand.data.msg[i].title;
        this.startSocket(middleHand.data.msg[i]._id);
        this.activeID = middleHand.data.msg[i]._id;
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
