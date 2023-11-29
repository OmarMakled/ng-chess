import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { IframePageComponent } from './iframe-page/iframe-page.component';
import { FirebaseService } from './firebase.service';
const firebaseConfig = {
  apiKey: "AIzaSyA4exyplb4f44FABl_UOZp5kDRRrchowvM",
  authDomain: "ng-chess-6f32c.firebaseapp.com",
  databaseURL: "https://ng-chess-6f32c-default-rtdb.firebaseio.com",
  projectId: "ng-chess-6f32c",
  storageBucket: "ng-chess-6f32c.appspot.com",
  messagingSenderId: "97710311336",
  appId: "1:97710311336:web:83a5d197d3e4a5cd31bf9d",
  measurementId: "G-YFEQFRFCG2"
};

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    IframePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    NgxChessBoardModule.forRoot()
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
