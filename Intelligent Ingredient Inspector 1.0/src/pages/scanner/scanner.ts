
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import {TestService} from '../../providers/testing-service';
import {CameraService} from "../../providers/camera-service";
import Cropper from 'cropperjs';
/*
 Generated class for the Scanner page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {

  @ViewChild('image') input: ElementRef;
  imageBase64: any;
  width: number;
  height: number;
  cropper: Cropper;
  croppedImgB64String: string;
  // labels: Array<any> = [];

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {

    this.imageBase64 = this.navParams.get("imageBase64");
    this.width = this.navParams.get("width");
    this.height = this.navParams.get("height");

  }



  cropperLoad() {
    //Set your required cropperJS options as seen here https://github.com/fengyuanchen/cropperjs/blob/master/README.md#options
    this.cropper = new Cropper(this.input.nativeElement, {
      dragMode: 'crop',
      aspectRatio: this.width / this.height,
      modal: true,
      guides: true,
      highlight: true,
      center: true,
      background: false,
      autoCrop: true,
      movable: false,
      zoomable: false,
      autoCropArea: 1,
      responsive: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      scalable: false,

      crop: (e: Cropper.CropperCustomEvent) => {}
    });

  }

  cropperReset() { this.cropper.reset() }

  imageRotate() { this.cropper.rotate(90); }

  cancel() { this.viewCtrl.dismiss(); }

  finish() {
    this.croppedImgB64String = this.cropper.getCroppedCanvas({
      width: this.width,
      height: this.height
    }).toDataURL('image/jpeg', (100 / 100));
    this.viewCtrl.dismiss(this.croppedImgB64String);



  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScannerPage');
  }

}
