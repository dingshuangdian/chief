import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';



/**
 * Generated class for the ProvincesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mntc-select',
  templateUrl: 'mntc-select.html',
})
export class MntcSelectPage {
  selectCla = [{ mntc_class_id: 0, mntc_class_name: '普通维修' }, { mntc_class_id: 1, mntc_class_name: '保险维修' }, { mntc_class_id: 2, mntc_class_name: '内部维修' }, { mntc_class_id: 3, mntc_class_name: '其他维修' }];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {


  }




  ionViewDidLoad() {
  }

  dismiss(item) {
    this.viewCtrl.dismiss(item);
  }
}
