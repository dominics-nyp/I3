import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {ScannerPage} from '../pages/scanner/scanner';

@Injectable()
export class TestService {

  //scanner : ScannerPage = new ScannerPage();

  apiKeys = {
    cloudVision :'AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0',
    //scanner:  'AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0'
  };

  apiUrls = {
    cloudVision : 'https://vision.googleapis.com/v1/images:annotate?key=',
    translate : 'https://www.googleapis.com/language/translate/v2?key=AIzaSyA4aIM1cmVijRq9EwTpvj81bJ6lGGdUcN0'
  };


  visionPostObj = {
    requests : [
      {
        image : {
          content : ''
        },
        features: {
          type: 'TEXT_DETECTION',
          //maxResults: 1
        }
      }
    ]
  };

  static get parameters() {
    return [[Http]];
  }



  constructor(private http: Http) {
    console.log('Hello CameraService Provider');

    //this.visionClient = new Vision();
  }




  getVisionLabels( image : string ){

    //let url = this.scanner.apiUrls.cloudVision + this.scanner.apiKeys.cloudVision;
    //let post = this.scanner.visionPostObj;
    let url = this.apiUrls.cloudVision + this.apiKeys.cloudVision;
    let post = this.visionPostObj;
    post.requests[0].image.content = image;

    return this.http.post(url, post).map( (res) => res.json());
  }

 /* getTranslation(){

  }*/




}
