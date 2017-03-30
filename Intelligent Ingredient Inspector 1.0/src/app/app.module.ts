import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CameraPage } from '../pages/camera/camera';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {SafePage} from '../pages/safe/safe';

@NgModule({
  declarations: [
    MyApp,
    CameraPage,
    ContactPage,
    HomePage,
    TabsPage,
    SafePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CameraPage,
    ContactPage,
    HomePage,
    TabsPage,
    SafePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
