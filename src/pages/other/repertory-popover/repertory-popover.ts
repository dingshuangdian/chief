import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';


@Component({
  selector: 'repertory-popover',
  templateUrl: 'repertory-popover.html',
})
export class repertoryPopover {

  repertory = [];
  hasSelected = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public websites: WebSites) {
  }
  findWareHousesInfo() {
    this.websites.httpPost("findWareHousesInfo", {}).subscribe(res => {
      if (res) {
        this.repertory = res;
        if (this.hasSelected && this.hasSelected.length > 0) {
          this.hasSelected.forEach(element => {
            if (element.select) {
              this.addSelect(element.warehouse_id)
            }
          });
        }
      }
    })
  }
  addSelect(i) {
    this.repertory.forEach(element => {
      if (element.warehouse_id == i) {
        element.select = true;
      }
    });
  }
  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    if (this.navParams.get("repertory")) {
      this.hasSelected = this.navParams.get("repertory");
    }
    this.findWareHousesInfo();
  }
  selectItem(i) {
    i.select = !i.select;
    if (i.select) {
      this.hasSelected.push(i);
    }
    if (!i.select) {
      this.hasSelected.forEach(element => {
        if (element.warehouse_id == i.warehouse_id) {
          element.select = false;
        }
      });
    }
  }
  ionViewDidLeave() {
    //this.repertory = [];
  }
  close(flag) {
    if (flag) {
      this.viewCtrl.dismiss(this.hasSelected);
    } else {
      this.hasSelected.forEach(element => {
        element.select = false;
      });
    }
  }
}
