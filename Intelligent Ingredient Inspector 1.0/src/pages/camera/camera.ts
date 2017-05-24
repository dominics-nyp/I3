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
import { AuthProvider } from '../../providers/auth-provider';


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
  allergyUser:Array<string> = [];
  userName:Array<any> = [];
  allergyUsers:Array<any> [];
  //userName:any;
   objUser:Array<any>=[];



  //userAllergy: any;

  //translation
  //allergy:string = "butter";
  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;

  allergean:Array<any> = [];
  userAllergean:Array<any> = [];
  imageExist:boolean = false;
  imageExistForBtn:boolean = false;



  userAllergy: FirebaseListObservable<any[]>;


  //results: Array<any> = [];
  //text: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public testService: TestService,public cameraService: CameraService,public toastCtrl: ToastController,public auth : AuthProvider,af : AngularFire) {

    var ref = firebase.database().ref('/user/'+ firebase.auth().currentUser.uid+'/profile/');
    // ref.on('value',this.gotData,this.errData);
    ref.on('value',
      ((data)=>{
        //var users = data.val();
        var users = data.val();
        var keys = Object.keys(users);
        console.log(keys);


        for(var y =0; y<keys.length; y++){
          this.objUser[y] = {};
          var x = keys[y];

          //this.objUser.length = 0;
          //var userName = users[x].name;
          //objUser[x] = {userName:'', userAllergies:[], resultWarning:[], resultUnsafe:[]}; //create object with UID
          this.objUser[y] = {userName:'', userAllergies:[], resultWarning:[], resultUnsafe:[]};  //create object without the UID
          console.log(users[x].allergies);
            //this.allergyUsers[x] = users[x].allergies;
          this.objUser[y].userName = users[x].name;
          //this.objUser[y].userAllergies.push(users[x].allergies);
          this.objUser[y].userAllergies = users[x].allergies;
          console.log('userAllergies',this.objUser[y].userAllergies);
          console.log(this.objUser[y].userAllergies.length);

        }

        console.log(this.objUser);
        console.log(this.objUser.length);
        //return this.objUser;
      }),
      this.errData);
  }


  gotData(data){




    //var users = data.val();
    var users = data.val();
    var keys = Object.keys(users);
    console.log(keys);

    for(var y =0; y<keys.length; y++){
      var x = keys[y];


      //var userName = users[x].name;
      //objUser[x] = {userName:'', userAllergies:[], resultWarning:[], resultUnsafe:[]}; //create object with UID
      this.objUser[y] = {userName:'', userAllergies:[], resultWarning:[], resultUnsafe:[]};  //create object without the UID


      this.objUser[y].userName = users[x].name;
      this.objUser[y].userAllergy = users[x].allergies;

    }

    console.log(this.objUser);
      //return this.objUser;
  }

  errData(){

  }

  checkImage(imageChecking: string){
    if(imageChecking == null){
      this.imageExist = false;
    }
    else{
      this.imageExist = true;
    }

  }
  checkNextBtn(imageCheck: string){
    if(imageCheck == null){
      this.imageExistForBtn = false;
    }
    else{
      this.imageExistForBtn = true;
    }
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
          this.checkImage(data);


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
        for (var i=0; i<this.objUser.length; i++) {
          this.objUser[i].resultUnsafe = [];
          this.objUser[i].resultWarning = [];
        }
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
   var result = [];
   var warningResult = [];
   var unSafeResult = [];
   var dataArray = [];
   var object = {};
   var userAllergyDetails = [];
   var len = 0;
   //var allergyObjUser = this.gotData(data);

   //let allergy:string[] = ["OIL"];

   //let allergy:string[] = [this.allergyUser.toString()];

      //dataArray = this.allergyList;
      //dataArray.push(this.allergyList);
    console.log('Data from firebase',dataArray);

     var label = this.labels[0];
     //console.log(label.description.toString().split(','));
     //var ingredients = label.description.toString().split([',','(',')']); //tokenizers
    //var ingredients = label.description.toString().split([',','(',')',' ']);

    var ingredients = label.description.toString().replace(/\n/g, " ")
      .split(/[:(,).""]/igm)
      .map(function (ingredients){
        return ingredients.trim()
      }, {

      });

      //var ingredientsLatest = ingredients.trim();
      //ingredients.forEach(t => console.log(`${t} \n`))

    //let ingredientList:string[] = ingredients;
       //let ingredientSortedList:string[] = ingredientList.sort();
       //ingredientList.push(ingredients);
        //console.log('list',ingredientList);
        //console.log(ingredientList.length);

   //trim array
   var ingredientList = ingredients.filter(function(ingredient){
     return ingredient.length > 0;
   });

   //remove duplicates
   ingredientList = ingredientList.filter(function(item, pos) {
     return ingredientList.indexOf(item) == pos;
   });

   //console.log('ingredient list',ingredientList);


    //   for(var k = 0; k<ingredientList.length; k++){
    //     if(ingredientList[k] === ""){
    //       ingredientList = ingredientList.filter((ingredientList) => {
    //         return ingredientList.trim() != '';
    //       });
    //     }
    //     ingredientList = ingredientList.filter(function (item,index,inputArray) {
    //       return inputArray.indexOf(item) == index;
    //     });
    //
    // }

   //remove duplicates

   for(var ingredientIndex=0; ingredientIndex <ingredientList.length; ingredientIndex++){

     //console.log(ingredientList);

     for(var userIndex=0; userIndex<this.objUser.length; userIndex++){ //user object
       //userAllergyDetails.push(this.objUser[j].allergyUser);
        //userAllergyDetails = this.objUser[j].userAllergies;
       //console.log('from loop objUser length',this.objUser.length);
          //len = this.objUser.length;

        //userAllergyDetails.push(this.objUser[j].userAllergies);
        //console.log(userAllergyDetails.length);

        //console.log(userAllergyDetails.length);

        /*for(var k=0; k<this.objUser[j].userAllergies.length; k++){

        }*/
       for(var allergyIndex =0; allergyIndex<this.objUser[userIndex].userAllergies.length; allergyIndex++){  //matching starts

        console.log('user Allergies',this.objUser[userIndex].userAllergies);
         var regexp = new RegExp(this.objUser[userIndex].userAllergies[allergyIndex], "igm");
         //var regexpDanger =  new RegExp(this.objUser[userIndex].userAllergies[allergyIndex], "i")

         console.log(ingredientList[ingredientIndex]);
         //ingredientList[ingredientIndex] = ingredientList[ingredientIndex].toUpperCase();
         //this.objUser[userIndex].userAllergies[allergyIndex] = this.objUser[userIndex].userAllergies[allergyIndex].toUpperCase();

         if(ingredientList[ingredientIndex].toUpperCase() === this.objUser[userIndex].userAllergies[allergyIndex].toUpperCase()) {
            //if(ingredientList[ingredientIndex].match(regexpDanger)){
           console.log('match');

           //var regexp = new RegExp(/^()(?!this.objUser[userIndex].userAllergies[allergyIndex]$).{1,}$/, "igm");

           this.objUser[userIndex].resultUnsafe.push(ingredientList[ingredientIndex]);
         }

           else if (ingredientList[ingredientIndex].match(regexp)) {
             console.log('match');

             this.objUser[userIndex].resultWarning.push(ingredientList[ingredientIndex]);
           }

         else{
           console.log('no match');
         }
       }
     }
   }

   console.log(unSafeResult);
    console.log('data retrieve from object',userAllergyDetails);
   console.log('length of the array',userAllergyDetails.length);
   console.log(this.objUser);

   this.navCtrl.push(UnSafePage,{
     userDetails:this.objUser});

 }




  backToHome():void{
    this.navCtrl.setRoot(HomePage);
  }
  showFlow():void{
    this.navCtrl.setRoot(UnSafePage);
  }
  ionViewDidLoad() {

  }
  ionViewWillEnter(){
      console.log('hello');

   /*for(var j=0; j<this.objUser.length; j++){
     this.objUser[j] = {userName:'',userAllergies:[], resultWarning:[], resultUnsafe:[]};
   }*/
  }

}
