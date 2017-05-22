import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth-provider'

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
  displayUnsafe:boolean = true;
  displayWarning:boolean = true;
  displaySafe:boolean = true;
  userProfile:Array<string> = [];
  userProfileList:Array<any> = [];
  //userDetailsList:Array<any> = [];
  userDetailsList:any[];
  user: FirebaseListObservable<any[]>;
  shownGroup = null;





  constructor(public navCtrl: NavController, public navParams: NavParams,public auth : AuthProvider,af : AngularFire) {
    //this.breakArray();
    //this.resultCardDisplay();
    this.userDetailsList = this.navParams.get('userDetails');
    console.log('resultPage',this.userDetailsList);


    af.database.list('/user/'+ firebase.auth().currentUser.uid+'/profile/',{preserveSnapshot:true})
      .subscribe(snapshots =>{
        snapshots.forEach(snapshot => {
          //console.log(snapshot.val().allergies);
          //console.log(snapshot.val());
          this.userProfile = snapshot.val().name;
          this.userProfileList.push(this.userProfile);

          //this.allergyUser = snapshot.val();
          //this.allergyUser = JSON.parse(snapshot.val());
          //this.allergyJson = JSON.parse(snapshot.val());
          //this.allergean.push(this.allergyUser);
          //console.log(this.allergean);
          //console.log(this.allergy);
        })
        console.log(this.userProfileList);
      });

  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

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
    console.log('warning',this.warning);
    this.warning.sort();
    this.unSafe.sort();

  }
    //console.log('new array',unSafe);
    //unSafe.splice(j,1);
    resultCardDisplay(){
        for(var i =0; i<this.userDetailsList.length; i++){
          if(this.userDetailsList[i].resultUnSafe.length > 0){
            this.displayUnsafe = false;
          }
          else if(this.userDetailsList[i].resultUnsafe.length == 0){
            this.displayUnsafe = true;
          }
          else if(this.userDetailsList[i].resultWarning.length >0){
            this.displayWarning = false;
          }
          else if(this.userDetailsList[i].resultWarning.length == 0){
            this.displayWarning = true;
          }
          else{
            this.displaySafe = true;
          }
        }
    }




  ionViewDidLoad() {
    console.log('ionViewDidLoad UnSafePage');
    //let warning = this.navParams.get('warnResult');
    //console.log(warning);

  }

}
