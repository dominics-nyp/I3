import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import {Camera} from 'ionic-native';
import { NavController, NavParams,ToastController } from 'ionic-angular';
//import {NavParams} from 'ionic-angular';
import {SafePage} from '../safe/safe';
//import {CameraService} from '../../providers/camera-service';
import {TestService} from '../../providers/testing-service';
import Cropper from 'cropperjs';
import {CameraService} from "../../providers/camera-service";



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

  labels: Array<any> = [];

  //translation

  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;


  //results: Array<any> = [];
  //text: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public testService: TestService,public cameraService: CameraService,public toastCtrl: ToastController) {
    //this.imageBase64 = this.navParams.get("imageBase64");
    //this.width = this.navParams.get("width");
    //this.height = this.navParams.get("height");

  }


  addPhoto(){


    this.cameraService.getImage(this.width,this.height,this.quality)
      .subscribe( (data) => {
          this.image = (data);
          //console.log(btoa(this.image));
          //this.image = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
          this.imageConvert = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
          //console.log(this.image);
          this.getVision(this.imageConvert);

          //this.getVision(btoa(this.image));
          //console.log(this.image);
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


        //this.getText();

      });




  }

  getText() {

    this.labels.forEach((label) => {
      let translation = {search: label.description, result: ''};
      //console.log(label.description);

      console.log(label.description);

    });

  }

}
