import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';


@Component({
  selector: 'coupon-popover',
  templateUrl: 'coupon-popover.html',
})
export class couponPopover {
  coupon = [{ name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public websites: WebSites) {
  }
  findWareHousesInfo() {

  }
  select(item) {
    this.viewCtrl.dismiss(item);
  }
  close(){
    this.viewCtrl.dismiss(1);
  }
  ionViewDidLoad() {
  }
}
