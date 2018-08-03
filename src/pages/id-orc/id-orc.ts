import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



/**
 * Generated class for the IdOrcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare let cordova: any;
@Component({
  selector: 'page-id-orc',
  templateUrl: 'id-orc.html',
})
export class IdOrcPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
  }

  ionViewDidLoad() {
   
  }
  toScan() {
    cordova.ocrplateidsmart.ocrplateidSmartOpen(function (data) {
      alert(JSON.stringify(data));
    })
  }
}
