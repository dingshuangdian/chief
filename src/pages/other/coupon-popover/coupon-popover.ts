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
    if(item.expired){
      this.csModal.showAlert('该优惠券已过期，请重新选择！');
      return ;
    }
    this.viewCtrl.dismiss(item);
  }
  close(){
    this.viewCtrl.dismiss(1);
  }
  ionViewDidLoad() {
    this.coupon = this.navParams.get('couponArr');
  }
}
