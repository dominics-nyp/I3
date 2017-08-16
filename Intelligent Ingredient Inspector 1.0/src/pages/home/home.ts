import { Component } from '@angular/core';
import { NavController , AlertController, ModalController} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import{ SigninPage } from'../signin/signin';
import * as firebase from 'firebase';
import {CameraPage} from '../camera/camera';
import { ProfilePage } from '../profile/profile';
import { DatalistPage } from '../datalist/datalist';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  testCheckboxOpen: boolean;
  testCheckboxResult;
  
  public pCode:any;
  user: FirebaseListObservable<any>;
  Allergies:FirebaseListObservable<any>;
  User: Array<{Name: string, Allergies: string,  icon: string,showUser: boolean}> = [];
 

  constructor(
    public navCtrl: NavController,
    public af: AngularFire,
    public ac: AlertController,
    public auth: AuthProvider,
    public mc: ModalController,
   ) {



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

  profile1(): void {
    this.navCtrl.push(ProfilePage);
  }

  checklist(Allergies):void{
    console.log(Allergies.ingredient);
  }


  addandsearch(Allergies,user):void{
    let prompt =this.ac.create();
    prompt.setTitle('Enter allergy');

    prompt.addInput({
      type: 'text',
      placeholder:'Enter allergy here',
    });
    prompt.addButton('Cancel');

    prompt.addButton({
      text: 'Add',
      handler: data => {
        this.user.update(user.$key,{
          allergies: data
        
        })
      }
    });
    prompt.present();
  }
    
  
      

  addAllergies(Allergies,user):void{
    let alert = this.ac.create();
    alert.setTitle('Allergies List');


     

  

   
}


 
  
      
  

    
    

}