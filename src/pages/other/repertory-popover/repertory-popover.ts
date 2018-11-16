import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'repertory-popover',
  templateUrl: 'repertory-popover.html',
})
export class repertoryPopover {

  repertory = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage) {
    this.repertory = this.navParams.get("repertory");

  }
  ionViewDidLoad() {
  }
  select(discount) {
    this.viewCtrl.dismiss(discount);
  }
}
