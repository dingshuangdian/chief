import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ProvincesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-provinces',
  templateUrl: 'provinces.html',
})
export class ProvincesPage {

  provinces1: Array<any> = ["粤", "京", "沪", "皖", "渝", "闽", "贵", "甘", "琼", "豫", "鄂", "湘", "冀", "黑", "苏", "赣", "吉", "辽", "蒙", "宁", "青", "陕", "川", "晋", "鲁", "新", "藏", "云", "浙", "津", "桂", "其他", "无牌"];
  provinces: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    if (this.navParams.get('provinces')) {
      this.provinces = this.navParams.get('provinces');
    } else {
      this.provinces = this.provinces1;
    }


  }

  ionViewDidLoad() {
  }

  dismiss(item) {
    this.viewCtrl.dismiss(item);
  }
}
