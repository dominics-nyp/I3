import {Directive, ElementRef} from '@angular/core';
import {Scope} from "@angular/core/src/profile/wtf_impl";
import {elementAt} from "rxjs/operator/elementAt";

/*
  Generated class for the DrawBox directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[draw-box]' // Attribute selector
})
export class DrawBox {

  constructor(public element:ElementRef,public scope:Scope) {
    //console.log('Hello DrawBox Directive');
  }
  //var ctx = element[0].getContext('2d');

  //ctx = ElementRef[0].getContext('2d');

    ctx = elementAt[0].getContext('2d');


}
