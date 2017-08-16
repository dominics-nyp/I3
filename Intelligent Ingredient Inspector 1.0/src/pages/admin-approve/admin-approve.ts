import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import * as firebase from 'firebase';

/*
  Generated class for the AdminApprovePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-approve',
  templateUrl: 'admin-approve.html'
})
export class AdminApprovePagePage {

  user: FirebaseListObservable<any>;
  
  upc:string;
  ingredient1: string;
  
  upcRequest:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    af: AngularFire,
    public ac: AlertController,
    public auth: AuthProvider,
    public mc: ModalController,
    public alertCtrl: AlertController,
     ) {

      this.user = af.database.list('upcRequests/');

      af.database.list('upcRequests/').subscribe((data)=>{
      this.upcRequest = data;
    });

      this.upc = navParams.get('upc');
      this.ingredient1 = navParams.get('ingredient1')
     }
  
  approve(upc , ingredient){
  
    let alert = this.alertCtrl.create({
      title: upc,
      subTitle: ingredient,
      buttons: [
        {
          text: 'Approve',
          handler: () => {
            this.upc = upc;
            this.ingredient1 = ingredient;
            this.createObject();
            this.deleteObject();
            
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  };

  createObject() {
    firebase.database().ref('upcDB').push({
      upc: this.upc,
      ingredient: this.ingredient1
    })
  }

  deleteObject(){
    this.upcRequest.forEach(element => {
      console.log("element"+ JSON.stringify(element))
      if(element.upc == this.upc){
        this.user.remove(element.$key)
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminApprovePagePage');
  }

}
