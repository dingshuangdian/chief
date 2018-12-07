import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';


@Component({
  selector: 'brand-popover',
  templateUrl: 'brand-popover.html',
})
export class brandPopover {
  brand = [];
  page = 1;
  brandhasSelected = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public websites: WebSites) {
  }
  findWareHousesInfo(infiniteScroll) {
    let param = {
      page: this.page,
      rows: 40,
    }
    this.websites.httpPost("findBrandList", param).subscribe(res => {
      if (res) {
        this.brand = this.brand.concat(res.rows);
        if (this.brandhasSelected && this.brandhasSelected.length > 0) {
          this.brandhasSelected.forEach(element => {
            if (element.selected) {
              this.addSelect(element.brand_id)
            }
          });
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
          if (res.rows.length < 40) {
            infiniteScroll.enable(false);
          }
        };
      } else {
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
        };
      }
      this.page++;
    })
  }
  
  addSelect(i) {
    this.brand.forEach(element => {
      if (element.brand_id == i) {
        element.selected = true;
      }
    });
  }
  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    if (this.navParams.get("brandhasSelected")) {
      this.brandhasSelected = this.navParams.get("brandhasSelected");
    }
    this.findWareHousesInfo("");
  }
  bselectItem(i) {
    i.selected = !i.selected;
    if (i.selected) {
      this.brandhasSelected.push(i);
    }
    if (!i.selected) {
      this.brandhasSelected.forEach(element => {
        if (element.brand_id == i.brand_id) {
          element.selected = false;
        }
      });
    }
  }
  ionViewDidLeave() {
    //this.brand = [];
  }
  close(flag) {
    if (flag) {
      this.viewCtrl.dismiss(this.brandhasSelected);
    } else {
      this.brandhasSelected.forEach(element => {
        element.selected = false;
      });
    }
  }
  doLoadMore(infiniteScroll) {

    this.findWareHousesInfo(infiniteScroll);
  }
}
