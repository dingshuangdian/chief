import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VisitedMsgPage } from './visited-msg/visited-msg'

/**
 * Generated class for the BusinessRemindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-business-remind',
  templateUrl: 'business-remind.html',
})
export class BusinessRemindPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessRemindPage');
  }

  goTo(){
    this.navCtrl.push(VisitedMsgPage);
  }
}
