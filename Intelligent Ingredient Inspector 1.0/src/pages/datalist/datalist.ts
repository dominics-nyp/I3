import { Component } from '@angular/core';
import { NavController , AlertController, ModalController, NavParams} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {AngularFire,FirebaseListObservable} from 'angularfire2';
import{ SigninPage } from'../signin/signin';
import * as firebase from 'firebase';
import {CameraPage} from '../camera/camera';
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


searchQuery:string='';
allergy:any;




 
 public user: FirebaseListObservable<any>;
 public Allergies:FirebaseListObservable<any>;

 

public Allergies1:Array<{allergies: string, checked: boolean}>;//array contains a list of objects. Each object needs to have a allergy:xx and checked: true/false
public user1;
public profile1:Array<{allergies: string, checked: boolean}>=[];


 User: Array<{Name: string, Allergies: string,  icon: string,showUser: boolean}> = [];
 


  constructor(
    public navCtrl: NavController,
    public af: AngularFire,
    public navParams: NavParams) {

    this.user = af.database.list('/user/' + firebase.auth().currentUser.uid + '/profile/' + '/allergies');
    this.Allergies = af.database.list('/ingredientDB/');
    
    

    // console.log("navParams: " + navParams.get("profile"));
    this.user1= navParams.get("user");
    this.profile1= navParams.get("profile");


    af.database.list('/ingredientDB/', { preserveSnapshot: true})
    .subscribe(snapshots=>{

      //profile1 = user's allergies
      
        snapshots.forEach(snapshot => {
        
     // this.Allergies1 = [];

         console.log(snapshot.key, snapshot.val());
    //  console.log("allergies :"+ this.profile1);
         
       
    //      //push allergies into Allergies1
    //      if(this.profile1 == snapshot.val().allergies)
    //   {
    //        snapshot.val().checked == true;
          
    //      //  console.log("checked is true");

    //        //push allergies to allergies; turn toggle to true
    //       this.Allergies1.push({
    //       allergies: snapshot.val().allergies,
    //        checked: true
           
    //       });

        
    //  }

    //      else
    //  {
    //    //    console.log("checked is false");
    //         this.Allergies1.push({
    //       allergies: snapshot.val().allergies,
    //        checked: false
    //       });
    //  }


console.log("this.profile : " + JSON.stringify(this.profile1));
    this.profile1.forEach(element => {
 this.Allergies1 = [];
     let flag:boolean =false;
         

        if(element == snapshot.val().allergies)
        {
            
           snapshot.val().checked == true;

           this.Allergies1.push({
           allergies: snapshot.val().allergies,
           checked: true
           
          });

//set the flag to true
      flag=true;
      console.log("flag: " + JSON.stringify(flag));

        }

 //check the flag and push the Allergies1 if the flag is false 
        else {
              // flag =false;
           snapshot.val().checked == false;
          //   console.log("hello");
          this.Allergies1.push({
            allergies: snapshot.val().allergies,
            checked: false
          });
         console.log("flag: " + JSON.stringify(flag));
        }


    });

        

    
        }
      

      
    
     

    );

    
    
    });

   
    }
  


  addchecked(allergy):void{
  
  //get user from class variable
  this.user1;
  //get profile from class variable
  this.profile1;
  //get Allergies1 from class variable

  //write Allergies1 to Firebase
  

}



      initializeItems();

        initializeItems(): void{

          this.allergy = [this.af.database.list('/ingredientDB/')];
  
  
    
  
 
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
    

togglechecked(allergy){
  // this.Allergies.update(allergy.$key, {checked: allergy.checked})
 

}




  ionViewDidLoad() {
    console.log('ionViewDidLoad DatalistPage');
  }

  
  backtodatalist():void {
    this.navCtrl.push(ProfilePage);
  }

  


}


