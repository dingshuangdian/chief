import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'city-popover',
  templateUrl: 'city-popover.html',
})
export class cityPopover {

  cityList = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
    this.cityList = this.navParams.get("t");

  }
  ionViewDidLoad() {
  }
  select(discount) {
    this.viewCtrl.dismiss(discount);
  }
}
