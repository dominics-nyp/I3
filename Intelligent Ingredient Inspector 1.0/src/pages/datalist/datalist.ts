import { Component } from '@angular/core';
import { NavController, AlertController, ModalController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { SigninPage } from '../signin/signin';
import * as firebase from 'firebase';
import { CameraPage } from '../camera/camera';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';

/*
  Generated class for the DatalistPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-datalist',
  templateUrl: 'datalist.html'
})


export class DatalistPage {


  searchQuery: string = '';
  allergy: any;


  public user: any;
  public Allergies: FirebaseListObservable<any>;


 
  public Allergies1: Array<{ allergies: string, checked: boolean }>;//array contains a list of objects. Each object needs to have a allergy:xx and checked: true/false
  public user1;
  public profile1: Array<{ allergies: string, checked: boolean }> = [];
  public id;


  User: Array<{ Name: string, Allergies: string, icon: string, showUser: boolean }> = [];



  constructor(
    public navCtrl: NavController,
    public af: AngularFire,
    public navParams: NavParams) {


    this.id = navParams.get("id");
    this.user;


    af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/' + this.id + '/allergies/', { preserveSnapshot: true })
      .subscribe((snapshots) => {
        this.user = snapshots;


        this.Allergies = af.database.list('/ingredientDB/');

        this.user1 = navParams.get("user");
        this.profile1 = navParams.get("profile");
        console.log("ID: " + (this.id));

        af.database.list('/ingredientDB/', { preserveSnapshot: true })
          .subscribe(snapshots => {
            //profile1 = user's allergies
            this.Allergies1 = [];
            let flag: boolean = false;

            snapshots.forEach(snapshot => {
              flag = false;

              this.user.forEach(element => {
                // console.log("element:" + element.val());
                // console.log("allergies: " + snapshot.val().allergies);

                if (element.val() == snapshot.val().allergies) {
                  console.log("in");
                  flag = true;
                  console.log("into flag");
                }
              });

              console.log("Flag: " + flag);
              this.Allergies1.push({
                allergies: snapshot.val().allergies,
                checked: flag
              });

            });

          });
      });
  }




  addchecked( ) {

    //get user from class variable
    this.user1;
    //get profile from class variable
    this.profile1;

    //loop through this.user { call .remove for all allergies}

    this.user.forEach(y => {
//remove
      this.af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/' + this.id + '/allergies/', { preserveSnapshot: true }).remove(y.allergies);

    })



    var newallergies = [];

    //get Allergies1 from class variable
    this.Allergies1.forEach(x => {
      if (x.checked == true) {
        // console.log("hi");
        // console.log(x.allergies);

        newallergies.push(
         x.allergies
        );

      }
    });
console.log("newallergies: " + JSON.stringify(newallergies));
//do update of firebase withnewallergies
     
  
 newallergies.forEach(a => {
      this.af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/' + this.id + '/allergies/', { preserveSnapshot: true }).push(a);
 });
 
 


this.navCtrl.pop(ProfilePage);

  }



  initializeItems();

  initializeItems(): void {

    this.allergy = this.af.database.list('/ingredientDB/');





  }




  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.allergy = this.allergy.filter((allergies) => {
        return (allergies.toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


 




  ionViewDidLoad() {
    console.log('ionViewDidLoad DatalistPage');
  }


  backtodatalist(): void {
    this.navCtrl.push(ProfilePage);
  }




}


