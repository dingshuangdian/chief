import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'hycount-popover',
  templateUrl: 'hycount-popover.html',
})
export class hycountPopover {

  discountList = {};
  discountCoefficient = [];
  type;
  v;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
    this.type = this.navParams.get("t");
    this.v = this.navParams.get("v");
    if (this.v == 1) {
      this.discountList = JSON.parse(window.localStorage.getItem('mrNum'));
    } else if (this.v == 2) {
      this.discountList = JSON.parse(window.localStorage.getItem('wcNum'));
    }
    this.discountList[this.type].forEach(element => {
      this.discountCoefficient.push({ discountCoefficient: element.discountCoefficient, discountId: element.discountId });
    });
  }
  ionViewDidLoad() {
  }
  select(discount) {
    this.viewCtrl.dismiss(discount);
  }
}
