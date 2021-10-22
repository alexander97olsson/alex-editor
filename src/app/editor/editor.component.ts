import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Socket } from 'ngx-socket-io';
import { globals } from '../token';
import { Router } from '@angular/router';
//import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  
  url = `https://ramverk-editor-alos17.azurewebsites.net/data`;
  updateUserUrl = `https://ramverk-editor-alos17.azurewebsites.net/data/user`;
  urlUsers = `https://ramverk-editor-alos17.azurewebsites.net/auth/users`;
  urlCreatePdf = `https://ramverk-editor-alos17.azurewebsites.net/create-pdf`;
  urlDownloadPdf = `https://ramverk-editor-alos17.azurewebsites.net/download-pdf`;
  title = 'Alex-Editor';
  public Editor = ClassicEditor;
  public objectDocs = {} as any;
  public objectDocsComp = [] as any;
  public objectUsers = {} as any;
  public objectUsersComp = [] as any;
  public nameArray: string[] = [];
  public selected = "";
  public userSelected = "";
  public consoleMessage = '';
  public activeID = "";
  public content = "";
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
  owner = new FormControl('');

  constructor(private socket: Socket, private router: Router) {
    if(!globals.token) {
      this.router.navigate(['/login'])
    }
  }

  ngOnInit() {
    this.onClickGetAll();
    this.owner.setValue(globals.userLogged);
    this.onClickUsers();
  }
  
  startSocket(id) {
    this.socket.emit("joinRoom", id);
    this.socket.on("getDoc", (data) => {
        this.mainText.setValue(data);
        console.log(data);
    });
  }
  
  
  saveToPdfNew() {
    var opt = {
      margin:       1,
      filename:     `${this.titleText.value}.pdf`,
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(this.content).set(opt).save()
  }

  public async saving() {
    this.updateMainText();
    var delivery = {
      maintext: this.content,
    };
    try {
      const response = await fetch('http://localhost:1337/create-pdf', {
        body: JSON.stringify(delivery),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      });
      const testar = await response.json();
      return testar;
      } catch (error) {
        console.error(error);
    }
  }

  async saveToPdf() {
    this.updateMainText();
    var delivery = {
      maintext: this.content,
    };
    await fetch('http://localhost:1337/create-pdf', {
        body: JSON.stringify(delivery),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async () => { await fetch('http://localhost:1337/download-pdf', {method: 'GET'})
        .then(response => response.blob())
        .then(function(myBlob) {
          var file = new Blob([myBlob], {type: "application/pdf"});
          return file;
        }).then((file) => saveAs(file, `pdfdokument`));
      })
  }

  updateMainText() {
    this.content = this.model.editorDataText;
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
      this.content = data.html
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
            'content-type': 'application/json',
            'x-access-token': globals.token
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
    this.objectDocsComp = [];
    this.objectDocs = await this.getAll();
    for (let i = 0; i < this.objectDocs.data.msg.length; i++) {
      if(this.objectDocs.data.msg[i].owner == globals.userLogged){
        console.log(i);
        this.objectDocsComp.push(this.objectDocs.data.msg[i]);
      }
      for (let j = 0; j < this.objectDocs.data.msg[i].allowed_users.length; j++) {
        if(this.objectDocs.data.msg[i].allowed_users[j] == globals.userLogged){
          this.objectDocsComp.push(this.objectDocs.data.msg[i]);
        }    
      }
    }
    this.updateMainText();
    this.updateTitleText();
  }

  async onSendMail(data) {
    console.log(data)
    const middleHand = await this.getAll();
    for (let i = 0; i < middleHand.data.msg.length; i++) {
      if(this.selected == middleHand.data.msg[i]._id) {
        var delivery = {
          __id: this.selected,
          allowed_users: data
        };
        fetch(this.updateUserUrl, {
          body: JSON.stringify(delivery),
          headers: {
            'content-type': 'application/json',
            'x-access-token': globals.token
          },
          method: 'PUT'
          }).then(function (response) {
            console.log(response)
          })
      }
      }
  }

  onClickSubmit(data) {
    this.updateMainText();
    this.updateTitleText();
    console.log("title is : " + data.titleText);
    console.log("object is : " + data);
    var delivery = {
      title: this.model.editorDataTitle,
      maintext: this.model.editorDataText,
      owner: globals.userLogged
    };
    fetch(this.url, {
      body: JSON.stringify(delivery),
      headers: {
          'content-type': 'application/json',
          'x-access-token': globals.token
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
          'content-type': 'application/json',
          'x-access-token': globals.token
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

   public async getAllUsers() {
    try {
      const response = await fetch(this.urlUsers, {
        headers: {
            'content-type': 'application/json',
            'x-access-token': globals.token
        },
        method: 'GET'
      });
      const result = await response.json();
      return result;
      } catch (error) {
        console.error(error);
    }
  }
  async onClickUsers() {
    this.objectUsersComp = []
    this.objectUsers = await this.getAllUsers();
    for (let i = 0; i < this.objectUsers.data.users.length; i++) {
      if (globals.userLogged != this.objectUsers.data.users[i].email) {
        this.objectUsersComp.push(this.objectUsers.data.users[i]);
      }
    }
  }

  async onClickSaveUser() {
    const middleHand = await this.getAll();
    for (let i = 0; i < middleHand.data.msg.length; i++) {
      if(this.selected == middleHand.data.msg[i]._id) {
        var delivery = {
          __id: this.selected,
          allowed_users: this.userSelected
        };
        fetch(this.updateUserUrl, {
          body: JSON.stringify(delivery),
          headers: {
            'content-type': 'application/json',
            'x-access-token': globals.token
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
