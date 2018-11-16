import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the InsProgPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ins-prog-popover',
  templateUrl: 'ins-prog-popover.html',
})
export class InsProgPopoverPage {

  fullPremium: any;//保单全费
  netPremium: any;//保单净费
  payFee = 1;//选择的支付类型
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.fullPremium = this.navParams.get('fullPremium');
    this.netPremium = this.navParams.get('netPremium');
  }
  // 确定
  comfirBtn(){
    this.viewCtrl.dismiss(this.payFee);
  }

}
