import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { repertoryPopover } from '../../other/repertory-popover/repertory-popover';


/**
 * Generated class for the BusinessRemindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({

  selector: 'page-check-help',
  templateUrl: 'check-help.html',
})
export class CheckHelpPage {
  seachInfo: any = { keyWord: '', page: '', rows: 20, warehouseId: 65 };
  customers;
  repertory;
  public courseTab = [
    { "name": "全部", "bol": true },
    { "name": "品牌", "bol": false },
    { "name": "仓库", "bol": false },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public changeDetectorRef: ChangeDetectorRef, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.findWareHousesInfo();

  }
  findWareHousesInfo() {
    this.websites.httpGet("findWareHousesInfo", {}).subscribe(res => {
      if (res) {
        console.log(res);
        this.repertory = res;
      }
    })
  }
  searchCk(key) {
    if (key) {
      this.seachInfo.keyWord = key;
    }

    this.websites.httpPost('findStocksInfo4Phone', this.seachInfo, false).subscribe(res => {
      console.log(res);
      this.customers = res.rows ? res.rows : [];
      this.changeDetectorRef.detectChanges();
    })
  }
  ionViewDidEnter() {
  }
  toggleTab(list, index) {
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
    }
    list[index].bol = true;
    switch (index) {
      case 0:

        break;
      case 1:

        break;
      case 2:
        this.presentPopover();

        break;

    }

  }
  presentPopover() {
    const popover = this.popoverCtrl.create(repertoryPopover, { repertory: this.repertory }, { cssClass: "repertoryModal" });
    popover.onDidDismiss(data => {
      if (data) {
        console.log(data);
      }
    });

    popover.present();
  }

}
