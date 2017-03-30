import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {NavParams} from 'ionic-angular';
//import {CameraService} from '../../providers/camera-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public navParams: NavParams) {

  }

  goCam(){
    //this.CameraPage.takePicture();
    //CameraPage.takePicture();
    //this.cameraService.takePicture();

    console.log('hh');

    //this.cameraService.takePicture();


  }

}
