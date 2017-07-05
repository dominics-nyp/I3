import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/catch'
import {Observable} from 'rxjs/Observable'
/*
  Generated class for the BarCodeScannerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BarCodeScannerProvider {
  static get parameters() {
        return [[Http]];
    }

    nbNumber : string;

  constructor(public http: Http) {
    
  }

  searchIngredient(ingredient) {
      var url ='https://api.nal.usda.gov/ndb/search/?format=json&name=' + encodeURI(ingredient) +'&sort=n&max=1&offset=0&api_key=Lw3sQQ3O75bfX5TSpnSO2ZR8W0hHOp729WO2UnKx';
      
      console.log("URL: " + url);
      var response = this.http.get(url).map(res => res.json());
      console.log("response: " + JSON.stringify(response));
      return response;
    }

    getIngredient(ingredient){
      return this.http.get('https://api.nal.usda.gov/ndb/search/?format=json&name=' + encodeURI(ingredient) +'&sort=n&max=1&offset=0&api_key=Lw3sQQ3O75bfX5TSpnSO2ZR8W0hHOp729WO2UnKx')
      .map(this.extractData)
      .do(this.logResponse)
      .catch(this.catchError)
  }

  private catchError(error: Response | any){
    console.log(error);
    return Observable.throw(error.json().error || "Server Error");
  }

  private logResponse(res: Response){
    console.log(res);
  }

  private extractData(res: Response){
    return res.json();
  }

    // getNbno(ingredient){
    //     var url ='https://api.nal.usda.gov/ndb/search/?format=json&name=' + encodeURI(ingredient) +'&sort=n&max=25&offset=0&api_key=Lw3sQQ3O75bfX5TSpnSO2ZR8W0hHOp729WO2UnKx';
        
    // }

}
