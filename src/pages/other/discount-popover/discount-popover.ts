import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'discount-popover',
  templateUrl: 'discount-popover.html',
})
export class discountPopover {

  discountList: Array<any> = ['100', '95', '90', '88', '85', '80'];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
  }

  select(discount) {
    this.viewCtrl.dismiss(discount);
  }

}
