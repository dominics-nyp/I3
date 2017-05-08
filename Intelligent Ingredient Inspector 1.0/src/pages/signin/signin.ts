import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import {SignupPage} from '../signup/signup';
import { HomePage} from '../home/home';
import { ResetPasswordPage } from '../reset-password/reset-password';
import {AngularFire} from "angularfire2";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  error: any;
  signupPage = SignupPage;
  resetPasswordPage = ResetPasswordPage;
  homePage = HomePage;


  constructor(public navCtrl: NavController, private fb: FormBuilder,public auth: AuthProvider,public af: AngularFire) {
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
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
  remember():void{
    this.af.auth.subscribe(user => {
      if (user) {
        this.navCtrl.setRoot(HomePage);
        console.log("11");
      } else {
        this.navCtrl.setRoot(SigninPage);
      }
    });

  }
}
