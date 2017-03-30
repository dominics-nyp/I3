import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Camera} from 'ionic-native';
//import { Vision } from '@google-cloud/vision';
//import gcloud from '@google-cloud';
//import {Client, Feature, Request, Image} from 'vision-cloud-api';
//import gcloud from 'vision-cloud-api';

import 'rxjs/add/operator/map';


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


  constructor(public http: Http) {
    console.log('Hello CameraService Provider');

    //this.visionClient = new Vision();
  }


  /*openCamera() {
    var options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL
    };
    Camera.getPicture(options).then((imageData) => {
      this.cameraData = 'data:image/jpeg;base64,' + imageData;
      this.photoTaken = true;
      this.photoSelected = false;
    }, (err) => {
      // Handle error
    });
  }*/

/*  testing(){
    // Imports the Google Cloud client library
    const Vision = require('@google-cloud/vision');

// Your Google Cloud Platform project ID
    const projectId = 'YOUR_PROJECT_ID';

// Instantiates a client
    const visionClient = Vision({
      projectId: projectId
    });

// The name of the image file to annotate
    const fileName = './resources/wakeupcat.jpg';

// Performs label detection on the image file
    visionClient.detectLabels(fileName)
      .then((results) => {
        const labels = results[0];

        console.log('Labels:');
        labels.forEach((label) => console.log(label));
      });
  }*/

  takePicture(){
   Camera.getPicture({

   destinationType: Camera.DestinationType.DATA_URL,

   targetWidth: 1000,
   targetHeight: 1000
   }).then((imageData) => {
   // imageData is a base64 encoded string
   this.base64Image = "data:image/jpeg;base64," + imageData;

   }, (err) => {
   console.log(err);
   });
   }
   displayPicture(){
   this.base64Image;
   }




}
