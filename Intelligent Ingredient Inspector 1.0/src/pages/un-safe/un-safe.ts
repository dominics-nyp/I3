import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the UnSafe page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-un-safe',
  templateUrl: 'un-safe.html'
})
export class UnSafePage {

  index:number;
  warning:any;
  unSafe:any;
  resultUnsafe:boolean = false;
  resultWarning:boolean = false;
  resultSafe:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.breakArray();
    this.resultCardDisplay();
  }
  breakArray(){

    this.warning = this.navParams.get("warningResult");
    this.unSafe = this.navParams.get("unSafeResult");


    //console.log(unSafe);
    //console.log(warning);


    /*for(var i =0; i<warning.length; i++){
      for(var j =0; j< unSafe.length; j++){
          if( warning[i] === unSafe[j]){


            unSafe.splice(j,1);

            console.log('new array',unSafe);

              //unSafe.splice(j,1);
          }
      }
    }*/


    for (var i = this.warning.length; i >= 0; i--) {
      for (var j = 0; j < this.unSafe.length; j++) {
        if (this.warning[i] === this.unSafe[j]) {


          this.warning.splice(i, 1);
        }
      }
    }
    console.log('unsafe',this.unSafe);
    this.warning.sort();
    this.unSafe.sort();

  }
    //console.log('new array',unSafe);
    //unSafe.splice(j,1);
    resultCardDisplay(){
      if(this.unSafe != []){
        this.resultUnsafe = true;
      }
      if(this.warning != []){
        this.resultWarning = true;
      }
      if(this.warning == [] && this.unSafe == []){
        this.resultSafe = true;
      }
      /*else if(this.unSafe == []){
        this.resultUnsafe = false;
      }*/


    }




  ionViewDidLoad() {
    console.log('ionViewDidLoad UnSafePage');
    //let warning = this.navParams.get('warnResult');
    //console.log(warning);

  }

}
