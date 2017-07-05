import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {SignupPage} from '../signup/signup';
import { HomePage} from '../home/home';
import { ResetPasswordPage } from '../reset-password/reset-password';
import {AngularFire} from "angularfire2";
import { NativePageTransitions, NativeTransitionOptions} from '@ionic-native/native-page-transitions'; 

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {


  splash = true;
  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
  signupPage = SignupPage;
  resetPasswordPage = ResetPasswordPage;
  homePage = HomePage;

  constructor(private nativePageTransitions: NativePageTransitions,public navCtrl: NavController, private fb: FormBuilder,public auth: AuthProvider,public af: AngularFire) {
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
    
  }

  ionViewWillLeave() {

 let options: NativeTransitionOptions = {
    direction: 'up',
    duration: 500,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
   };

 this.nativePageTransitions.slide(options)
  // .then(onSuccess)
   //.catch(onError);

}

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 4000);
  }

  login(): void {
    if(this.loginForm.valid) {
      var credentials = ({email: this.email.value, password: this.password.value});
      this.auth.loginWithEmail(credentials).subscribe(data => {
        this.navCtrl.setRoot(HomePage);
        console.log(data);
      }, error=>{
        console.log(error);
        if (error.code == 'auth/user-not-found')
        {
          alert('User not found');
        }
      });
    }
  }
  skip():void{
    this.navCtrl.setRoot(HomePage);
  }
}
