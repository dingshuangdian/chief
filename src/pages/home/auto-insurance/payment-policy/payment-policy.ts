import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WxPayPopoverPage } from '../../../other/wx-pay-popover/wx-pay-popover';

/**
 * Generated class for the PaymentPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment-policy',
  templateUrl: 'payment-policy.html',
})
export class PaymentPolicyPage {

  orderId: any;//订单号
  qryPayCode: any = {};//保单信息
  paymentMode = 1;//选择支付方式
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public webSites: WebSites,
    public popCtrl: PopoverController,
  ) {
    this.orderId = this.navParams.get('orderId');
  }

  //请求保单信息
  reqPay(){
    this.webSites.httpPost('qryPayOrderInfo',{
      'orderId': this.orderId
    })
    .subscribe(res => {
      this.qryPayCode = res;
      this.webSites.httpPost('qryPayCode',{
        'orderId': this.orderId
      })
      .subscribe(res => {
        this.qryPayCode.codeUrl = res.codeUrl;
      });
    });
  }

  //确认
  payCertain(){
    let popover = this.popCtrl.create(WxPayPopoverPage,{
      'codeUrl': this.qryPayCode.codeUrl,
    });
    // popover.onDidDismiss({});
    popover.present();
  }
}
