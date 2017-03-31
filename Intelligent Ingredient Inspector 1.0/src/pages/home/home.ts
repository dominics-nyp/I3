import { Component } from '@angular/core';
import { NavController , AlertController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import{ SigninPage } from'../signin/signin';
import {CameraPage} from '../camera/camera'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, af : AngularFire, public ac:AlertController,public auth : AuthProvider) {
    this.user= af.database.list('/user');
  }
  addProfile():void{
    let prompt = this.ac.create({
      title:'New profile',
      message:'Enter name',
      inputs: [
        {
          name : 'name',
          placeholder: "name"
        },
        {
          name: 'allergies',
          placeholder: "allergies"
        }
      ],
      buttons:[
        {
          text:"Cancel",
          handler : data=>{
            console.log("cancel clicked");
          }
        },
        {
          text:"Save Profile",
          handler: data => {

            /*            firebase.auth().onAuthStateChanged(function(user) {
             if (user) {
             userID = user.uid;
             console.log(userID); // this prints fine
             }
             })*/

            this.user.push({
              name: data.name,
              allergies:data.allergies
            })
          }
        }
      ]
    });

    prompt.present();
  }
  /* editProfile(user)
   let alert = this.ac.create();
   alert.setTitle('What Allergies do you have?');

   alert.addInput({
   type:'checkbox',
   label:'Milk',
   value:'Milk',
   });

   alert.addInput({
   type:'checkbox',
   label:'Eggs',
   value:'Egg',
   });

   alert.addInput({
   type:'checkbox',
   label:'Peanuts',
   value:'peanut',
   });

   alert.addInput({
   type:'checkbox',
   label:'Tree nuts',
   value:'tnuts',
   });

   alert.addInput({
   type:'checkbox',
   label:'Soy',
   value:'soy',
   });

   alert.addButton('Cancel');
   alert.addButton({
   text: 'Save',
   handler: data =>{
   let newAllergies:String = user.allergies;
   alert.present();*/
  editProfile(user):void{
    let prompt = this.ac.create({
      title:'Edit profile',
      message:'Edit name and allergies',
      inputs: [
        {
          name : 'name',
          placeholder:user.name
        },
        {
          name: 'allergies',
          placeholder: user.allergies
        },
      ],
      buttons:[
        {
          text:"Cancel",
          handler : data=>{
            console.log("cancel clicked");
          }
        },
        {
          text:"Save Profile",
          handler: data => {
            let newName:String = user.name;
            let newAllergies:String = user.allergies;

            if(data.name !=''){
              newName = data.name;
            }

            if(data.allergies !=''){
              newAllergies = data.allergies;
            }
            this.user.update(user.$key,{
              name: newName,
              allergies: newAllergies,
            })

          }
        }
      ]
    });
    prompt.present();
  }
  deleteProfile(userID):void{
    let prompt = this.ac.create({
      title:'Delete profile',
      buttons:[
        {
          text:"Cancel",
          handler : data=>{
            console.log("cancel clicked");
          }
        },
        {
          text:"Delete Profile",
          handler: data => {
            this.user.remove(userID);
          }
        }
      ]
    });

    prompt.present();
  }
  logout(): void {
    this.auth.logout();
    this.navCtrl.setRoot(SigninPage);
  }
  camera():void{
    this.navCtrl.setRoot(CameraPage);
  }
}
