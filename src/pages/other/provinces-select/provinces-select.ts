import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';


/**
 * Generated class for the ProvincesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-provinces-select',
  templateUrl: 'provinces-select.html',
})
export class ProvincesSelectPage {
  selectCla = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public websites: WebSites) {
    this.websites.httpPost("findServiceTypeTree",{}).subscribe(res => {
      if (res != null) {
        this.selectCla = res;
      }
    }, error => {
      console.error(error);

    })

  }




  ionViewDidLoad() {
  }

  dismiss(item) {
    this.viewCtrl.dismiss(item);
  }
}
