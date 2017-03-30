import { Component,OnInit } from '@angular/core';
import {Camera} from 'ionic-native';
import { NavController } from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {SafePage} from '../safe/safe';
//import {CameraService} from '../../providers/camera-service';
import {TestService} from '../../providers/testing-service';
import { CropImageModal } from '../modals/crop-image/crop-image';



@Component({

  templateUrl: 'camera.html'
})
export class CameraPage {

  public base64Image: string;
  //public  base64Image: Array<bytes>
  //image:any;


  labels: Array<any> = [];
  //translation
  scanning: Array<any> = [];
  choseLang: boolean = false;
  loading: boolean = false;


  //results: Array<any> = [];
  //text: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private testService: TestService) {


  }

  takePicture() {
    Camera.getPicture({

      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000



    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      //this.detectText(imageData);
      this.getVision(imageData);
      //console.log(imageData);

    }, (err) => {
      console.log(err);
    });
  }



  /* newTranslation(){
   this.scanning = this.labels = [];
   let photo  : any = document.querySelector('#snap');
   photo.setAttribute('src', '');
   }*/


  /*  takePicture(){
   let canvas : any = document.querySelector('#canvas'),
   video  : any = document.querySelector('#video'),
   photo  : any = document.querySelector('#snap'),
   width  : number = video.clientWidth,
   height  : number = video.clientHeight;

   canvas.width = width;
   canvas.height = height;
   canvas.getContext('2d').drawImage(video, 0, 0, width, height);

   let image = canvas.toDataURL('image/jpeg', 1);
   photo.setAttribute('src', image);

   this.loading = true;
   this.getVision( image.replace('data:image/jpeg;base64,', '') );
   }*/

  /*getTranslation(){
   console.log('detect');
   this.labels.forEach( (label) => {
   let translation = {search : label.description, result : ''};

   this.testService.getTranslation( label.description, this.selectedLanguage.code)
   .subscribe( (sub) => {
   translation.result= sub.data.translations[0].translatedText;
   this.loading = false;
   this.translations = [];
   this.translations.push(translation);
   });

   })
   }*/

  getVision(base64image: string) {
    this.testService.getVisionLabels(base64image)
      .subscribe((sub) => {

        this.labels = sub.responses[0].textAnnotations;

        this.getText();
        //this.labels = sub.results[0];
        //console.log('Text:');
        //this.labels.forEach(())
        //this.getTranslation();

      });
  }

  getText() {

    this.labels.forEach((label) => { //technically declare the label here via foreach
      let translation = {search: label.description, result: ''};
      //console.log(label.description);
      console.log(label.description);
    });
    /*'use strict';

     detectText(base64image: string){


     const Vision = require('@google-cloud/vision');

     const vision = new Vision();

     vision.detectText(base64image)
     .subscribe((results) => {
     const detections = results[0];

     console.log('Text:');
     detections.forEach((text) => console.log(text));
     });



     }*/

    /*ngOnInit() {
     let video   : any = document.querySelector('#video'),
     w       : any = window,
     n       : any = navigator;

     n.getMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);

     n.getMedia(
     {
     video: true,
     audio: false
     },
     function(stream) {
     if(n.mozGetUserMedia){
     video.mozSrcObject = stream;
     }else{
     var vendorURL = w.URL || w.webkitURL;
     video.src = vendorURL.createObjectURL(stream);
     }
     video.play();
     },
     function(err) {
     console.log("An error occured! " + err.message);
     }
     );
     }*/

    /*goPicture(){
     this.cameraService.takePicture();


     this.navCtrl.push(SafePage,{
     //image:this.cameraService.cameraUrl
     image:this.cameraService.base64Image,
     });

     }



     ionViewWillEnter(){
     this.goPicture();

     }*/


  }
}
