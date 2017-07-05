import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CameraPage } from '../pages/camera/camera';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {SafePage} from '../pages/safe/safe';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SigninPage } from '../pages/signin/signin';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AuthProvider} from '../providers/auth-provider';
import {ScannerPage} from '../pages/scanner/scanner';
import {UnSafePage} from "../pages/un-safe/un-safe";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { BarCodeScannerProvider } from '../providers/bar-code-scanner/bar-code-scanner';

export const firebaseConfig={
  apiKey: "AIzaSyCbC1pjcS2mcAi5SXRchAn92wyfHvmnIlI",
  authDomain: "intelligentingredientins-ce9a1.firebaseapp.com",
  databaseURL: "https://intelligentingredientins-ce9a1.firebaseio.com",
  storageBucket: "intelligentingredientins-ce9a1.appspot.com",
  messagingSenderId: "355998361503"
};

@NgModule({
  declarations: [
    MyApp,
    CameraPage,
    ContactPage,
    HomePage,
    TabsPage,
    SafePage,
    SignupPage,
    ResetPasswordPage,
    SigninPage,
    ScannerPage,
    UnSafePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)


  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CameraPage,
    ContactPage,
    HomePage,
    TabsPage,
    SafePage,
    SignupPage,
    ResetPasswordPage,
    SigninPage,
    ScannerPage,
    UnSafePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider, BarcodeScanner, NativePageTransitions,
    BarCodeScannerProvider
  ]
})
export class AppModule {}
