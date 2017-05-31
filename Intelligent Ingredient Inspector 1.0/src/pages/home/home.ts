import { Component } from '@angular/core';
import { NavController , AlertController, ModalController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import{ SigninPage } from'../signin/signin';
import * as firebase from 'firebase';
import {CameraPage} from '../camera/camera';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
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
    public mc: ModalController) {

    this.user = af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/');
    this.Allergies=af.database.list('/ingredientDB/');
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

  editProfile(user): void {
    let prompt = this.ac.create({
      title: 'Edit profile',
      message: 'Edit name and allergies',
      inputs: [
        {
          name: 'name',
          placeholder: user.name
        },
        {
          name: 'allergies',
          placeholder: user.allergies
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
            let newName: String = user.name;
            let newAllergies: String = user.allergies;

            if (data.name != '') {
              newName = data.name;
            }

            if (data.allergies != '') {
              newAllergies = data.allergies;
            }
            this.user.update(user.$key, {
              name: newName,
              allergies: newAllergies,
            })

          }
        }
      ]
    });
    prompt.present();
  }

  deleteProfile(userID): void {
    console.log('hi');
    let prompt = this.ac.create({
      title: 'Delete profile',
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

  logout(): void {
    this.auth.logout();
    this.navCtrl.setRoot(SigninPage);
  }

  camera(): void {
    this.navCtrl.setRoot(CameraPage);
  }

  checklist(Allergies):void{
    console.log(Allergies.ingredient);
  }


  addAllergies(Allergies,user):void{
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
  }
}
