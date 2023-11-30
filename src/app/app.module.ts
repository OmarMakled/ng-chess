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
import { FirebaseConfig } from './app.config';

@NgModule({
  declarations: [AppComponent, MainPageComponent, IframePageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(FirebaseConfig.appConfig)),
    provideFirestore(() => getFirestore()),
    NgxChessBoardModule.forRoot(),
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
