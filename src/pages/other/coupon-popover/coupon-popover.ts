import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsModal } from '../../../providers/cs-modal';


@Component({
  selector: 'coupon-popover',
  templateUrl: 'coupon-popover.html',
})
export class couponPopover {
  coupon: any;
  hasSelect;
  paiclUpMoney;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public websites: WebSites,
    public csModal: CsModal,
  ) {
  }
  findWareHousesInfo() {
  }
  select(item) {
    if (this.paiclUpMoney > item.couponAmount) {
      this.viewCtrl.dismiss({ item: item, paiclUpMoney: this.paiclUpMoney });
    } else {
      this.csModal.showToast("优惠卷金额大于支付金额");
    }
  }
  close() {
    if (this.hasSelect) {
      this.viewCtrl.dismiss({ item: this.hasSelect, paiclUpMoney: this.paiclUpMoney });
    } else {
      this.viewCtrl.dismiss({ item: 1, paiclUpMoney: this.paiclUpMoney });
    }
  }
  unuse() {
    this.viewCtrl.dismiss({ item: 1, paiclUpMoney: this.paiclUpMoney });
  }
  ionViewDidLoad() {
    this.coupon = this.navParams.get('couponArr');
    this.paiclUpMoney = this.navParams.get("paiclUpMoney");
    this.hasSelect = this.navParams.get("hasSelect");
  }
}
