import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
//import {NavParams} from 'ionic-angular';
import { SafePage } from '../safe/safe';
//import {CameraService} from '../../providers/camera-service';
import { TestService } from '../../providers/testing-service';
import Cropper from 'cropperjs';
import { CameraService } from "../../providers/camera-service";
import { HomePage } from "../home/home";
import { AddItemPagePage } from "../add-item/add-item";
import { UnSafePage } from '../un-safe/un-safe';
import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthProvider } from '../../providers/auth-provider';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BarCodeScannerProvider } from '../../providers/bar-code-scanner/bar-code-scanner';
import { TranslationService } from '../../providers/translation.service';
import { AdminApprovePagePage } from '../admin-approve/admin-approve'

@Component({

  templateUrl: 'camera.html',
  providers: [BarCodeScannerProvider]

})
export class CameraPage {

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
  //userName:any;
  objUser: Array<any> = [];

  //scanner
  options: BarcodeScannerOptions;
  results: {};
  barcodeResult: string;
  addObj: Array<any>;
  ingredient: Array<any>;
  barcodeText: string;
  bcText: {};
  ndbnoList: Array<any> = [];
  ndbno: string;
  itemList: string;
  itemList1: Array<any> = [];
  SCmessage: string;
  upc: string;
  //userAllergy: any;

  //translation
  //allergy:string = "butter";
  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;

  allergean: Array<any> = [];
  userAllergean: Array<any> = [];
  imageExist: boolean = false;
  imageExistForBtn: boolean = false;

  userAllergy: FirebaseListObservable<any[]>;

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

  //upc

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
    //upc
    af.database.list('upcDB/').subscribe((data) => {
      this.upcFB = data;
    });
    //upc

    //translate
    this.translationservice = translationservice;
    //translate

    var ref = firebase.database().ref('/user/' + firebase.auth().currentUser.uid + '/profile/');
    // ref.on('value',this.gotData,this.errData);
    ref.on('value',
      ((data) => {
        //var users = data.val();
        var users = data.val();
        var keys = Object.keys(users);
        console.log(keys);

        for (var y = 0; y < keys.length; y++) {
          this.objUser[y] = {};
          var x = keys[y];
          this.objUser[y] = { userName: '', userAllergies: [], resultWarning: [], resultUnsafe: [] };  //create object without the UID
          console.log(users[x].allergies);
          //this.allergyUsers[x] = users[x].allergies;
          this.objUser[y].userName = users[x].name;
          //this.objUser[y].userAllergies.push(users[x].allergies);
          
          var allergiesArray = [];
          var allergiesKeys = Object.keys(users[x].allergies);
          for (var z = 0; z < allergiesKeys.length; z++) {
            allergiesArray.push(users[x].allergies[allergiesKeys[z]]);
          }
          
          this.objUser[y].userAllergies = allergiesArray;//users[x].allergies;
          



          console.log('userAllergies', this.objUser[y].userAllergies);
          console.log(this.objUser[y].userAllergies.length);

        }

        console.log(this.objUser);
        console.log(this.objUser.length);
      }),
      this.errData);
  }


  gotData(data) {

    var users = data.val();
    var keys = Object.keys(users);
    console.log(keys);

    for (var y = 0; y < keys.length; y++) {
      var x = keys[y];
      this.objUser[y] = { userName: '', userAllergies: [], resultWarning: [], resultUnsafe: [] };  //create object without the UID
      this.objUser[y].userName = users[x].name;
      this.objUser[y].userAllergy = users[x].allergies;
    }
    console.log(this.objUser);
  }

  errData() {
  }

  checkImage(imageChecking: string) {
    if (imageChecking == null) {
      this.imageExist = false;
    }
    else {
      this.imageExist = true;
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



  addPhoto() {

    this.cameraService.getImage(this.width, this.height, this.quality).subscribe((data) => {
      this.image = (data);
      this.imageConvert = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.getVision(this.imageConvert);
      this.checkImage(data);

    }, (error) => {

      this.toast(error);
    }
    );
  }

  //scan bar code

  alertScan() {

    let alert = this.alertCtrl.create({
      subTitle: "Get your food scanned",
      buttons: [
        {
          text: 'Scan',
          handler: () => {
            console.log('Scan clicked');
            this.scanBarcode();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Add clicked');
          }
        }
      ]
    });
    alert.present();
  }

  async scanBarcode() {

    this.options = {
      prompt: 'Scan a barcode to see the result!'
    };
    this.results = this.barcode.scan()
      .then((results) => {
        this.barcodeText = results.text;
        this.barCodeScannerProvider.getIngredient(this.barcodeText).subscribe(data => {
          console.log('Data' + JSON.stringify(data));

          if (data.list != null) {
            this.ndbno = data.list.item[0].ndbno;
            console.log('Go into If');

            this.barCodeScannerProvider.getIngredientList(this.ndbno).subscribe(data => {
              this.itemList1 = data.report.food.ing.desc;
              //console.log(this.labels[0]);
              //this.getText();
              for (var i = 0; i < this.objUser.length; i++) {
                this.objUser[i].resultUnsafe = [];
                this.objUser[i].resultWarning = [];
              }
              this.matchText1(this.itemList1);

            });

          } else {
            console.log("Go into else if");

            var flag = false;

            this.upcFB.forEach(upcItem => {
              if (upcItem.upc == this.barcodeText) {
                flag = true;
                this.matchText1(upcItem.ingredient);
              }
            });
            if(flag == false){
            console.log("go into else!");
                let alert = this.alertCtrl.create({
                  subTitle: "Barcode not found! If you wish to add the product into our database, please click the add button",
                  buttons: [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        console.log('Add clicked');
                      }
                    },
                    {
                      text: 'Add',
                      handler: () => {
                        this.navCtrl.push(AddItemPagePage, { upc: this.barcodeText });
                        console.log("barcode text" + this.barcodeText);
                        console.log('Add clicked');
                      }
                    }
                  ]
                });
                alert.present();
            }



          }
          // else {
          //   console.log("go into else!");
          //   let alert = this.alertCtrl.create({
          //     subTitle: "Barcode not found! If you wish to add the product into our database, please click the add button",
          //     buttons: [
          //       {
          //         text: 'Cancel',
          //         role: 'cancel',
          //         handler: () => {
          //           console.log('Add clicked');
          //         }
          //       },
          //       {
          //         text: 'Add',
          //         handler: () => {
          //           this.navCtrl.push(AddItemPagePage, { upc: this.barcodeText });
          //           console.log("barcode text" + this.barcodeText);
          //           console.log('Add clicked');
          //         }
          //       }
          //     ]
          //   });
          //   alert.present();
          // }
        });
      })
      .catch((error) => {
        alert(error);
      });

  }


  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Item cannot be found',
      buttons: ['OK']
    });
    alert.present();
  }


  searchBarcodeDB(barcodeText) {
    this.barCodeScannerProvider.searchIngredient(barcodeText).subscribe(
      data => {
        this.ingredient = data.results;
        console.log("Data" + data);
      },
      err => {
        console.log(err);
      },
      () => console.log('Barcode Search Complete')
    );
  }
  //scan bar code
  matchText1(array) {

    var result = [];
    var warningResult = [];
    var unSafeResult = [];
    var dataArray = [];
    var object = {};
    var userAllergyDetails = [];
    var len = 0;

    console.log('Data from firebase', dataArray);

    var label = this.itemList1

    var ingredients = label.toString().replace(/\n/g, " ")
      .split(/[:(,).""]/igm)
      .map(function (ingredients) {
        return ingredients.trim()
      }, {

      });


    //trim array
    var ingredientList = ingredients.filter(function (ingredient) {
      return ingredient.length > 0;
    });

    //remove duplicates
    ingredientList = ingredientList.filter(function (item, pos) {
      return ingredientList.indexOf(item) == pos;
    });

    //remove duplicates

    for (var ingredientIndex = 0; ingredientIndex < ingredientList.length; ingredientIndex++) {

      //console.log(ingredientList);

      for (var userIndex = 0; userIndex < this.objUser.length; userIndex++) {
        //user object
        for (var allergyIndex = 0; allergyIndex < this.objUser[userIndex].userAllergies.length; allergyIndex++) {  //matching starts

          console.log('user Allergies', this.objUser[userIndex].userAllergies);

          var regexp = new RegExp(this.objUser[userIndex].userAllergies[allergyIndex], "igm");

          console.log(ingredientList[ingredientIndex]);

          if (ingredientList[ingredientIndex].toUpperCase() === this.objUser[userIndex].userAllergies[allergyIndex].toUpperCase()) {
            console.log('match');
            this.objUser[userIndex].resultUnsafe.push(ingredientList[ingredientIndex]);
          }
          else if (ingredientList[ingredientIndex].match(regexp)) {
            console.log('match');
            this.objUser[userIndex].resultWarning.push(ingredientList[ingredientIndex]);
          }
          else {
            console.log('no match');
          }
        }
      }
    }

    console.log(unSafeResult);
    console.log('data retrieve from object', userAllergyDetails);
    console.log('length of the array', userAllergyDetails.length);
    console.log(this.objUser);

    this.navCtrl.push(UnSafePage, {
      userDetails: this.objUser
    });

  }
  //scann barcode

  toast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      showCloseButton: false
    });
    toast.present();
  }


  getVision(image64: string) {

    this.testService.getVisionLabels(image64)
      .subscribe((sub) => {

        this.labels = sub.responses[0].textAnnotations;
        console.log("read this lables :" + this.labels);
        //console.log(this.labels[0]);
        //this.getText();
        for (var i = 0; i < this.objUser.length; i++) {
          this.objUser[i].resultUnsafe = [];
          this.objUser[i].resultWarning = [];
        }
        // this.labels = labels.description.toString().replace(this.translate(this.labels[0].description));

        this.translate(this.labels[0].description);
        console.log(this.translatedText+ "translted text")
        //this.testingText();
      });

  }

  //google translate
  translate(sourceText) {
    console.log("Source Text!!!" + JSON.stringify(sourceText));
    this.translationservice.translateText(sourceText).subscribe(data => {
      this.data = data;
      this.translatedText = this.data.translatedText;
      console.log("translated Text" + this.translatedText);
      this.sourceLanguageCode = this.data.detectedSourceLanguage;
      this.matchText(this.translatedText);
    });
  }


  //google translate


  matchText(array) {

    var result = [];
    var warningResult = [];
    var unSafeResult = [];
    var dataArray = [];
    var object = {};
    var userAllergyDetails = [];
    var len = 0;

    console.log('Data from firebase', dataArray);

    var label = this.translatedText;
    console.log("LABEL!!!" + JSON.stringify(label));

    var ingredients = label.toString().replace(/\n/g, " ")
      .split(/[:(,).""]/igm)
      .map(function (ingredients) {
        return ingredients.trim()
      }, {

      });


    //trim array
    var ingredientList = ingredients.filter(function (ingredient) {
      return ingredient.length > 0;
    });

    //remove duplicates
    ingredientList = ingredientList.filter(function (item, pos) {
      return ingredientList.indexOf(item) == pos;
    });

    //remove duplicates

    for (var ingredientIndex = 0; ingredientIndex < ingredientList.length; ingredientIndex++) {

      //console.log(ingredientList);

      for (var userIndex = 0; userIndex < this.objUser.length; userIndex++) {
        //user object
        for (var allergyIndex = 0; allergyIndex < this.objUser[userIndex].userAllergies.length; allergyIndex++) {  //matching starts

          console.log('user Allergies', this.objUser[userIndex].userAllergies);

          var regexp = new RegExp(this.objUser[userIndex].userAllergies[allergyIndex], "igm");

          console.log(ingredientList[ingredientIndex]);

          if (ingredientList[ingredientIndex].toUpperCase() === this.objUser[userIndex].userAllergies[allergyIndex].toUpperCase()) {
            console.log('match');
            this.objUser[userIndex].resultUnsafe.push(ingredientList[ingredientIndex]);
          }
          else if (ingredientList[ingredientIndex].match(regexp)) {
            console.log('match');
            this.objUser[userIndex].resultWarning.push(ingredientList[ingredientIndex]);
          }
          else {
            console.log('no match');
          }
        }
      }
    }

    console.log(unSafeResult);
    console.log('data retrieve from object', userAllergyDetails);
    console.log('length of the array', userAllergyDetails.length);
    console.log(this.objUser);

    this.navCtrl.push(UnSafePage, {
      userDetails: this.objUser
    });

  }



  backToHome(): void {
    this.navCtrl.setRoot(HomePage);
  }
  showFlow(): void {
    this.navCtrl.setRoot(UnSafePage);
  }
  ionViewDidLoad() {
  }
  adminApp(): void {
    this.navCtrl.setRoot(AdminApprovePagePage);
  }
  ionViewWillEnter() {
    console.log('hello');
  }

}