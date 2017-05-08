import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import {Camera} from 'ionic-native';
import { NavController, NavParams,ToastController } from 'ionic-angular';
//import {NavParams} from 'ionic-angular';
import {SafePage} from '../safe/safe';
//import {CameraService} from '../../providers/camera-service';
import {TestService} from '../../providers/testing-service';
import Cropper from 'cropperjs';
import {CameraService} from "../../providers/camera-service";
import {HomePage} from "../home/home";
import {UnSafePage} from '../un-safe/un-safe';
import firebase from 'firebase';
import {AngularFire,FirebaseListObservable} from 'angularfire2';


@Component({

  templateUrl: 'camera.html'
})
export class CameraPage {
  /* @ViewChild('image') input: ElementRef;
   imageBase64: any;
   //public base64Image: string;
   //public  base64Image: Array<bytes>
   //image:any;
   width: number;
   height: number;
   cropper: Cropper;*/

  public image:string;
  width:number = 500;
  height:number = 500;
  quality:number = 90;
  picture:string;
  public imageConvert: string;
  newLabel:Array<any> = [];
  labels: Array<any> = [];
  public counter:number = 0;
  warningResult:Array<string> = [];


  //userAllergy: any;

  //translation
  allergy:string = "butter";
  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;
  allergyRef:any;
  allergyList:any;
  loadedAllergyList:any;

  userAllergy: FirebaseListObservable<any>;


  //results: Array<any> = [];
  //text: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public testService: TestService,public cameraService: CameraService,public toastCtrl: ToastController,public af : AngularFire) {
    //this.imageBase64 = this.navParams.get("imageBase64");
    //this.width = this.navParams.get("width");
    //this.height = this.navParams.get("height");
    //this.userAllergy = af.database.list('/intelligentingredientins-ce9a1');
    //this.allergyRef = af.database.list('/ingredientDB');
    //this.allergyRef = firebase.database().ref('/ingredientDB');

   /* this.allergyRef.on('value',allergyList =>{
        let allergyUser = [];
        allergyList.forEach(user =>{
          //allergyUser.push(allergyUser.val());
          allergyUser.push(user.val());
        });

        this.allergyList = allergyUser;
        this.loadedAllergyList = allergyUser;
        console.log(allergyUser);
    });*/


    /*this.countryRef.on('value', countryList => {
      let countries = [];
      countryList.forEach( country => {
        countries.push(country.val());
      });

      this.countryList = countries;
      this.loadedCountryList = countries;
    });*/

   this.allergyRef = firebase.database().ref('/ingredientDB');

   this.allergyRef.on('value', snapshot =>{
     console.log(snapshot.val());
     this.allergyList = snapshot.val();
   })

    //console.log('data',this.userAllergy);

  }



  addPhoto(){


    this.cameraService.getImage(this.width,this.height,this.quality)
      .subscribe( (data) => {
          this.image = (data);

          //this.image = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
          this.imageConvert = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
          //console.log(this.image);
          this.getVision(this.imageConvert);
          //this.matchText();


        },(error) => {
          // Toast errot and return DEFAULT_PHOTO from Constants
          this.toast(error);
        }
      );
  }

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
        //console.log(this.labels[0]);
        //this.getText();
        this.matchText(this.labels[0]);

        //this.testingText();
      });

  }


 matchText(array){
    //var count = 0;
    //this.loadedAllergy = this.userAllergy;
    //console.log(this.loadedAllergy);
   //console.log(JSON.stringify(this.userAllergy));
   //console.log('database node',this.allergyList);
   var warningResult = [];
   var unSafeResult = [];
   let allergy:string[] = ["SUGAR","OIL"];

    for(var i = 0; i < 1; i++) {

      var dataArray = this.allergyList;
      console.log('Data from firebase',dataArray);

       var label = this.labels[i];
       //console.log(label.description.toString().split(','));
       //var ingredients = label.description.toString().split([',','(',')']); //tokenizers
      //var ingredients = label.description.toString().split([',','(',')',' ']);

      var ingredients = label.description.toString().split(/[(,).]/igm).map(function (ingredients){return ingredients.trim()}, {

      });

      //var ingredientsLatest = ingredients.trim();
      //ingredients.forEach(t => console.log(`${t} \n`))



       let ingredientList:string[] = ingredients;
       let ingredientUpdatedList:string[];
       //ingredientList.push(ingredients);
        //console.log('list',ingredientList);
        //console.log(ingredientList.length);

      for(var k = 0; k<ingredientList.length; k++){
        if(ingredientList[k] === ""){
          ingredientList = ingredientList.filter((ingredientList) =>{
            return ingredientList.trim() != '';
          });
        }
      }


      for(var j = 0; j<ingredientList.length; j++){
        //let allergy:string = "OIL";
        //let allergy:string[] = ["OIL","SUGAR"];
        //let safeResult:string[];
        //let unSafeResult:string[];


        for(var e = 0; e<allergy.length; e++) {
          var regexp = new RegExp(allergy[e], "igm");

          console.log(ingredientList[j]);

          if(ingredientList[j] === allergy[e]){

           //unSafeResult[j] = ingredientList[j];
           //console.log('unSafe',unSafeResult);
            unSafeResult.push(ingredientList[j].valueOf());

          }

            if(ingredientList[j].match(regexp)){
            this.counter++;

              warningResult.push(ingredientList[j].valueOf());
              console.log('Match');
            //console.log('Ingredients that matched',unSafeResult);
          }

          else {
            console.log('No Match');


          }

        }

      }

      console.log('warning', warningResult);

      if(this.counter >0){
        //this.counter = 0;
        this.navCtrl.push(UnSafePage,{unSafeResult,warningResult});
          //this.navCtrl.push(UnSafePage);


      }
      else{
        this.navCtrl.push(SafePage);
      }


    }

  }


  getText() {

    var keepLooping = true;
    this.labels.forEach((label) => {
      //console.log(label[label.length-1]);
      //console.log(this.labels[this.labels.length-1]);
      //let translation = {search: label.description, result: ''};
      if(keepLooping) {
        if (label.description == 'MILK') {
          console.log('match');
          keepLooping = false;
          this.navCtrl.push(UnSafePage);
        }
      }


        /*else if(this.labels[this.labels.length-1] && label.description != 'MILK') {
          console.log('no match');
          //keepLooping = false;
          this.navCtrl.push(SafePage);
        }*/
        else{
          console.log('no match');
      }

      //console.log(label.description);
      //console.log(label[0]);
      //console.log(label.description);

    });

  }

  backToHome():void{
    this.navCtrl.setRoot(HomePage);
  }
  showFlow():void{
    this.navCtrl.setRoot(SafePage);
  }
  ionViewDidLoad() {
    this.counter = 0;
    console.log(this.counter);
  }
  ionViewDidEnter(){
   this.counter = 0;
  }

}
