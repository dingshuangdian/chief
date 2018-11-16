import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'company-popover',
  templateUrl: 'company-popover.html',
})
export class companyPopover {
  t;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
    this.t = this.navParams.get("t");
   
  }
  ionViewDidLoad() {
  }
  select(discount) {
    this.viewCtrl.dismiss(discount);
  }
}
