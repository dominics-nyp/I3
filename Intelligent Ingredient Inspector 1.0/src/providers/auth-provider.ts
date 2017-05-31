/**
 * Created by L31006 on 31/3/2017.
 */
import {Injectable, EventEmitter, Inject} from '@angular/core';
import { AuthProviders, AngularFire, FirebaseAuthState, AuthMethods, FirebaseApp } from 'angularfire2'; //Add FirebaseApp
import { Observable } from "rxjs/Observable";
import { Component } from '@angular/core';
import {root} from "rxjs/util/root";

@Injectable()
export class AuthProvider {
  private authState: FirebaseAuthState;
  public onAuth: EventEmitter<FirebaseAuthState> = new EventEmitter();
  public firebase : any;
  constructor(private af: AngularFire,@Inject(FirebaseApp)firebase:any) {
    this.firebase = firebase;
    this.af.auth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      this.onAuth.emit(state);
    });
  }

  loginWithEmail(credentials) {
    return Observable.create(observer => {
      this.af.auth.login(credentials, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((authData) => {
        console.log(authData);
        observer.next(authData);
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  registerUser(credentials: any) {
    return Observable.create(observer => {
      this.af.auth.createUser(credentials).then(authData => {
        observer.next(authData);
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  resetPassword(emailAddress:string){
    return Observable.create(observer => {
      this.firebase.auth().sendPasswordResetEmail(emailAddress).then(function(success) {
        observer.next(success);
      }, function(error) {
        observer.error(error);
      });
    });
  }

  logout() {
    this.af.auth.logout();
  }

  get currentUser():string{
    return this.authState?this.authState.auth.email:'';
  }

  get currentUID():string{
    return this.authState?this.authState.auth.uid:'';
  }



}
