import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'departments-popover',
  templateUrl: 'departments-popover.html',
})
export class departmentsPopover {
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
