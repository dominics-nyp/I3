import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {CameraPage} from '../camera/camera';
import {CameraService} from '../../providers/camera-service';
//import {Camera} from '../pages/camera/camera';

/*
  Generated class for the Safe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-safe',
  templateUrl: 'safe.html'
})
export class SafePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  displayBasePic(){
    //this.cameraService.displayPicture();
    //this.cameraService.base64Image;
  }
  backToCamera(){
    this.navCtrl.setRoot(CameraPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SafePage');
  }

}
