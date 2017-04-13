import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Camera} from 'ionic-native';
import { AlertController, Platform, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {CameraPage} from '../pages/camera/camera';
import {ScannerPage} from '../pages/scanner/scanner';

/*
 Generated class for the CameraService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class CameraService {
  public base64Image: string;
  /*cameraData: string;
   photoTaken: boolean;
   cameraUrl: string;
   photoSelected: boolean;*/





  constructor(public platform: Platform, public alertCtrl: AlertController, public modalCtrl: ModalController, private http: Http) {


    //this.visionClient = new Vision();
  }






  getImage(width: number, height: number, quality: number) {
    return Observable.create(observer => {
      //Set default options for taking an image with the camera
      let imageOptions: any = {
        quality: quality,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: 1,
        saveToPhotoAlbum: false,
        mediaType: Camera.MediaType.PICTURE,
        cameraDirection: 1
      };

      let selectAlert = this.alertCtrl.create({
        title: 'Let\'s add a picture!',
        message: "Select how you would like to add the picture",
        enableBackdropDismiss: false,
        buttons: [{
          text: 'Albums',
          handler: data => {
            //Change sourceType to PHOTOLIBRARY
            imageOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            selectAlert.dismiss();
          }
        }, {
          text: 'Camera',
          handler: data => {
            selectAlert.dismiss();
          }
        }]
      });

      selectAlert.onDidDismiss(() => {
        this.getCameraImage(imageOptions).subscribe(image => {   //image options are either album or camera**

          let cropModal = this.modalCtrl.create(ScannerPage, { "imageBase64": image, "width": 500, "height": 500 });
          cropModal.onDidDismiss((croppedImage: any) => {
            if (!croppedImage)
              observer.error("Canceled while cropping.")
            else {
              observer.next(croppedImage);
              observer.complete();

            }
          });
          cropModal.present();


        }, error => observer.error(error));
      });
      selectAlert.present();
    });
  }



  getCameraImage(options: any) { //get base64 image
    return Observable.create(observer => {
      this.platform.ready().then(() => {
        Camera.getPicture(options).then((imageData: any) => {
          // imageData is a base64 encoded string as per options set above
          let base64Image = "data:image/jpeg;base64," + imageData;
          //let base64Image = imageData;
          observer.next(base64Image);
          observer.complete();
        }, error => {
          observer.error(error);
        });
      });
    });
  }
}
