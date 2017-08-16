import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthProvider } from '../../providers/auth-provider';
import { TestService } from '../../providers/testing-service';
import Cropper from 'cropperjs';
import { CameraService } from "../../providers/camera-service";
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';
import { BarCodeScannerProvider } from '../../providers/bar-code-scanner/bar-code-scanner';
import { TranslationService } from '../../providers/translation.service';
import { HomePage } from '../home/home';
import { CameraPage } from '../camera/camera';
/*
  Generated class for the AddItemPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html'
})
export class AddItemPagePage {
  //photo
  public image: string;
  width: number = 500;
  height: number = 500;
  quality: number = 90;
  picture: string;
  public imageConvert: string;
  newLabel: Array<any> = [];
  labels: Array<any> = [];
  public counter: number = 0;
  warningResult: Array<string> = [];
  allergyUser: Array<string> = [];
  userName: Array<any> = [];
  allergyUsers: Array<any>[];
  objUser: Array<any> = [];

  //photo
  //Translate
  data;
  errorMsg;
  sourceText: string;
  translatedText: string;
  sourceLanguageCode: string;
  sourceLanguageName = 'Translate a text!';
  targetLanguageCode: string;
  targetLanguageName = 'Choose a language!';
  languages = [];
  //Translate
  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;

  allergean: Array<any> = [];
  userAllergean: Array<any> = [];
  imageExist: boolean = false;
  imageExist1: boolean = true;
  imageExistForBtn: boolean = false;
  imageExistForBtn1: boolean = true;

  userAllergy: FirebaseListObservable<any[]>;

  ingredient: Array<any>;
  barcodeText: string;
  bcText: {};
  ndbnoList: Array<any> = [];
  ndbno: string;
  itemList: string;
  itemList1: Array<any> = [];
  SCmessage: string;

  //scanner
  options: BarcodeScannerOptions;
  results: {};
  barcodeResult: string;
  addObj: Array<any>;
  //scanner

  //item
  user: FirebaseListObservable<any>;
  upc: string;
  ingredient1: string;
  count: number;
  //item

  upcFB: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public testService: TestService,
    public cameraService: CameraService,
    public toastCtrl: ToastController,
    public auth: AuthProvider,
    af: AngularFire,
    private barCodeScannerProvider: BarCodeScannerProvider,
    private http: Http,
    private barcode: BarcodeScanner,
    private translationservice: TranslationService
  ) {


    this.upc = navParams.get('upc');

    af.database.list('upcRequests').subscribe((data) => {
      this.upcFB = data;
    });

  }
  checkImage(imageChecking: string) {
    if (imageChecking == null) {
      this.imageExist = false;
    }
    else {
      this.imageExist = true;
    }
  }

  checkImage1(imageChecking: string) {
    if (imageChecking == null) {
      this.imageExist1 = true;
    }
    else {
      this.imageExist1 = false;
    }
  }

  checkNextBtn(imageCheck: string) {
    if (imageCheck == null) {
      this.imageExistForBtn = false;
    }
    else {
      this.imageExistForBtn = true;
    }
  }
  checkNextBtn1(imageCheck: string) {
    if (imageCheck == null) {
      this.imageExistForBtn1 = true;
    }
    else {
      this.imageExistForBtn1 = false;
    }
  }

  toast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      showCloseButton: false
    });
    toast.present();
  }

  //google translate
  translate(sourceText) {

    this.translationservice.translateText(sourceText).subscribe(data => {
      this.data = data;
      this.translatedText = this.data.translatedText;
      this.sourceLanguageCode = this.data.detectedSourceLanguage;
      this.ingredient1 = this.translatedText;
      this.upc = this.upc;
      //
    });
  }

  //google translate

  addPhoto() {

    this.cameraService.getImage(this.width, this.height, this.quality).subscribe((data) => {
      this.image = (data);
      this.imageConvert = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.getVision(this.imageConvert);
      this.checkImage(data);
      this.checkImage1(data);

    }, (error) => {
      this.toast(error);
    }
    );
  }

  getVision(image64: string) {

    this.testService.getVisionLabels(image64)
      .subscribe((sub) => {

        this.labels = sub.responses[0].textAnnotations;
        for (var i = 0; i < this.objUser.length; i++) {
          this.objUser[i].resultUnsafe = [];
          this.objUser[i].resultWarning = [];
        }
        this.translate(this.labels[0].description);
      });
  }

  // createObject() {
  //   firebase.database().ref('upcDB').push({
  //     upc: this.upc,
  //     ingredient: this.translatedText
  //   })
  // }

  createObject() {
    firebase.database().ref('upcRequests').push({
      upc: this.upc,
      ingredient: this.translatedText,
      count: this.count = 1
    })
  }

  createObject1(key ,count) {
    var updates = {};
    updates[key + "/count"] = count + 1;
    firebase.database().ref('upcRequests/').update(updates);
  }
  

  showFlow(): void {
    this.navCtrl.setRoot(CameraPage);
  }


  showFlowYes() {

    var flag = false;

    this.upcFB.forEach(upcItem => {
      if (upcItem.upc == this.upc) {

        flag = true;
        this.createObject1(upcItem.$key, upcItem.count);

        let alert = this.alertCtrl.create({
          subTitle: "Item has been successfully added into our Database, please wait for approval",
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.navCtrl.setRoot(HomePage);
                console.log('Add Okay');
              }
            }
          ]
        });
        alert.present();
        this.navCtrl.setRoot(CameraPage);

      }
    });
    if(flag == false){
    console.log("went into else")
        this.createObject();
        let alert = this.alertCtrl.create({
          subTitle: "Item has been successfully added into our Database, please wait for approval",
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.navCtrl.setRoot(HomePage);
                console.log('Add Okay');
              }
            }
          ]
        });
        alert.present();
        this.navCtrl.setRoot(CameraPage);
    }
  }


}

