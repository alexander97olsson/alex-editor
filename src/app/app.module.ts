import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { LogInComponent } from './user/log-in/log-in.component';
import { RegisterComponent } from './user/register/register.component';

//const config: SocketIoConfig = { url: 'http://localhost:1337', options: {} };
const config: SocketIoConfig = { url: 'https://ramverk-editor-alos17.azurewebsites.net', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    LogInComponent,
    RegisterComponent,
    HomeComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
