import { Component } from '@angular/core';
import { NavController , AlertController, ModalController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import { AuthProvider } from '../../providers/auth-provider';
import * as firebase from 'firebase';
import {CameraPage} from '../camera/camera';
import{ SigninPage } from'../signin/signin';
import { DatalistPage } from '../datalist/datalist';


/*
  Generated class for the ProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

   testCheckboxOpen: boolean;
  testCheckboxResult;

 

  user: FirebaseListObservable<any>;
  Allergies:FirebaseListObservable<any>;
  User: Array<{Name: string, Allergies: string,  icon: string,showUser: boolean}> = [];
 

  constructor(
    public navCtrl: NavController,
    af: AngularFire,
    public ac: AlertController,
    public auth: AuthProvider,
    public mc: ModalController,
    
   ) {

    this.user = af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/');
    this.Allergies=af.database.list('/ingredientDB/');
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  backtoprofile():void{
    this.navCtrl.push(HomePage);
  }
  datalist(user, profile): void{
    this.navCtrl.push(DatalistPage, {user: user.name, profile: user.allergies});
  }



     addProfile(): void {
    let prompt = this.ac.create({
      title: 'New profile',
      message: 'Enter name',
      inputs: [
        {
          name: 'name',
          placeholder: "name"
        },
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("cancel clicked");
          }
        },
        {
          text: "Save Profile",
          handler: data => {


            this.user.push({
              name: data.name,
            })
          }
        }
      ]
    });

    prompt.present();
  }



    deleteProfile(userID): void {
    console.log('delete clicked');
    let prompt = this.ac.create({
      title: 'Delete profile?',
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("cancel clicked");
          }
        },
        {
          text: "Delete Profile",
          handler: data => {
            this.user.remove(userID);
          }
        }
      ]
    });

    prompt.present();
  }

addnew():void{
  let prom =this.ac.create({
    title: 'Add new allergy',
    message: 'Enter allergy name',
    inputs: [
      {
        name: 'allergies',
        placeholder: 'Allergy name'
      }

    ],
    buttons: [
      {
        text: "cancel",
        handler: data=> {
          console.log("cancel clicked");
        }
      },
      {
        text: "Add",
        handler:data =>{
          this.Allergies.push({
           allergies: data.allergies,
           checked: true
          })
        }
      }
    ]
  })
  prom.present();
}

  /* addAllergies(Allergies,user):void{
    let alert = this.ac.create();
    alert.setTitle('Allergies List');

     

  

    alert.addInput({
      type: 'checkbox',
      label: 'Peanut',
      value: 'PEANUT',

    });

    alert.addInput({
      type: 'checkbox',
      label: 'Egg',
      value: 'EGG',

    });

    alert.addInput({
      type: 'checkbox',                                                                               
      label: 'Prawn',
      value: 'PRAWN',

    });


    alert.addInput({
      type: 'checkbox',
      label: 'Sugar',
      value: 'SUGAR',

    });

     alert.addInput({
      type: 'checkbox',
      label: 'Potato',
      value: 'POTATO',

    });
    
       
    alert.addButton('Cancel');
  
          
          
    alert.addButton({
      text: 'OK',
      handler: data => {
        
       this.user.update(user.$key,{
          allergies: data
        
       })
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });


    alert.present(() =>{
      this.testCheckboxOpen=true;
    });

 
}*/
}