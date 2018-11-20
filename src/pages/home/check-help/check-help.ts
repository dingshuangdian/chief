import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { repertoryPopover } from '../../other/repertory-popover/repertory-popover';
import { CsModal } from '../../../providers/cs-modal';
import { brandPopover } from '../../other/brand-popover/brand-popover';


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
  pages = 1;
  seachInfo: any = { keyWord: '', page: 1, rows: 20, warehouseId: [], brandId: [] };
  customers = [];
  repertory = [];
  brandhasSelected = [];
  moredata = true;
  infiniteScroll;
  public courseTab = [
    { "name": "全部", "bol": true },
    { "name": "品牌", "bol": false },
    { "name": "仓库", "bol": false },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public changeDetectorRef: ChangeDetectorRef, public popoverCtrl: PopoverController, public csModal: CsModal) {
  }
  ionViewDidLoad() {
  }
  searchOrder(infiniteScroll) {
    if (!this.seachInfo.keyWord) return;
    if (this.customers.length <= 20) {
      this.pages = 2;
    }
    this.seachInfo.page = infiniteScroll ? this.pages : 1;
    this.websites.httpPost('findStocksInfo4Phone', this.seachInfo, false).subscribe(res => {
      if (res.rows) {
        if (infiniteScroll) {
          this.moredata = true;
          this.customers = this.customers.concat(res.rows);
          infiniteScroll.complete();
          if (res.rows.length < 20) {
            infiniteScroll.enable(false);
          }
          this.pages++;
        } else {
          this.customers = res.rows;
          this.moredata = res.rows.length < 20 ? false : true;
        };
      } else {
        this.customers = [];
        this.moredata = false;
      }
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
        this.seachInfo.warehouseId = [];
        this.seachInfo.brandId = [];
        this.repertory = [];
        this.brandhasSelected = [];
        this.searchOrder("");
        break;
      case 1:
        this.brandPopover();
        break;
      case 2:
        this.repertoryPopover();
        break;
    }
  }
  repertoryPopover() {
    this.csModal.showProvince(repertoryPopover, { repertory: this.repertory }, (data) => {
      if (data) {
        this.repertory = data;
        this.seachInfo.warehouseId = [];
        data.forEach(element => {
          if (element.select) {
            this.seachInfo.warehouseId.push({ id: element.warehouse_id })
          }
        });
        this.searchOrder("");
      }
    });
  }
  brandPopover() {
    this.csModal.showProvince(brandPopover, { brandhasSelected: this.brandhasSelected }, (data) => {
      if (data) {
        this.brandhasSelected = data;
        this.seachInfo.brandId = [];
        data.forEach(element => {
          if (element.selected) {
            this.seachInfo.brandId.push({ id: element.brand_id });
          }
        });
        this.searchOrder("");
      }
    });
  }
  doLoadMore(infiniteScrolll) {
    this.infiniteScroll = infiniteScrolll;
    this.searchOrder(this.infiniteScroll);
  }
  change() {
    this.pages = 1;
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
  }

}
