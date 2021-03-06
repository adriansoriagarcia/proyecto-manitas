import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';

//Importamos nuestro Social Sharing plugin 
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule],
  providers: [
    SocialSharing,
    ImagePicker,
    CallNumber,

    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
