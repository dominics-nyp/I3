import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  apiKeys = {
    cloudVision :'AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0',
    scanner:  'AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0'
  };

  apiUrls = {
    cloudVision : 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0',
    //translate : 'https://www.googleapis.com/language/translate/v2?key=AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0'
  };


  visionPostObj = {
    requests : [
      {
        image : {
          content : ''
        },
        features: {
          type: 'TEXT_DETECTION',
          maxResults: 1
        }
      }
    ]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScannerPage');
  }

}
