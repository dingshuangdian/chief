import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController  } from 'ionic-angular';
import { PaymentPolicyPage } from '../payment-policy/payment-policy';
import { WebSites } from '../../../../providers/web-sites';
import { CsModal } from '../../../../providers/cs-modal';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { InsProgPopoverPage } from '../../../other/ins-prog-popover/ins-prog-popover';

/**
 * Generated class for the ReservationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reservation-list',
  templateUrl: 'reservation-list.html',
})
export class ReservationListPage {

  orderId: string;//订单id
  insuredMsg = {//被保人信息
    'insuredName': '',//被保人姓名
    'carownerCard': '',//证件号码
    'insuredMobile': '',//手机号码
  }
  consigneeMsg = {//收件人信息
    'consignee': '',//收件人姓名
    'consigneeMobile': '',//手机号码
    'consigneeType': 1,//收件方式
    'consigneeAddress': '',//收件地址
  }
  fullPremium: any;//保单全费
  netPremium: any;//保单净费
  payFee: any;//支付方式
  storeInfo = {//用户信息
    companyName: '',
    companyAddress: '',
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private popCtrl: PopoverController,
    public webSites: WebSites,
    public csModal: CsModal,
    public csbzNave: CsbzNave,
  ) {
    this.orderId = this.navParams.get('orderId');
    this.storeInfo.companyName = this.navParams.get('userName');
    this.storeInfo.companyAddress = this.navParams.get('companyAddress');
    this.reqOrderInfo();
  }

  //提交信息
  payOrder() {
    if (this.consigneeMsg.consignee == null || this.consigneeMsg.consignee.trim() == '') {
      this.csModal.showAlert('请填写收件人姓名','','','确定','','');
      return;
    }
    if (this.consigneeMsg.consigneeMobile == null || this.consigneeMsg.consigneeMobile.trim() == '') {
      this.csModal.showAlert('请填写手机号码','','','确定','','');
      return;
    }
    if (!this.csbzNave.checkTelephone(this.consigneeMsg.consigneeMobile)) {
      this.csModal.showAlert('手机号码格式不对','','','确定','','');
      return;
    }
    if (this.consigneeMsg.consigneeType == 1 || this.consigneeMsg.consigneeType == 4) {
      if (this.consigneeMsg.consigneeAddress == null || this.consigneeMsg.consigneeAddress.trim() == '') {
        this.csModal.showAlert('请填写收件地址','','','确定','','');
        return;
      }
    }
    let param = {
      orderId: this.orderId,
      consignee: this.consigneeMsg.consignee,
      consigneeMobile: this.consigneeMsg.consigneeMobile,
      consigneeType: this.consigneeMsg.consigneeType,
      consigneeAddress: this.consigneeMsg.consigneeAddress,
      fullPremium: this.fullPremium,
      netPremium: this.netPremium,
    };
    this.webSites.httpPost('payOrder',param)
    .subscribe(res => {
      this.csModal.showAlert('提交成功，等待客服处理',()=>{
        let popover = this.popCtrl.create(InsProgPopoverPage,{
          'fullPremium': this.fullPremium,
          'netPremium': this.netPremium,
        });
        popover.onDidDismiss(data => {
          this.payFee = data;
        });
        popover.present();
      },'','确定','','');
    },err => {
      this.csModal.showAlert(err,'','','确定','','');
    });
    
  }

  // 获取保单详情
  reqOrderInfo(){
    this.webSites.httpPost('qryOrderInfo',{
      'orderId': this.orderId,
    })
    .subscribe(res => {
      this.insuredMsg.insuredName = res.insuredName;
      this.insuredMsg.carownerCard = res.carownerCard;
      this.insuredMsg.insuredMobile = res.insuredMobile;
      this.consigneeMsg.consignee = res.consignee;
      this.consigneeMsg.consigneeMobile = res.consigneeMobile;
      this.consigneeMsg.consigneeAddress = res.consigneeAddress;
      this.fullPremium = res.fullPremium;
      this.netPremium = res.netPremium;
    });
  }

  // 选择
  sendChooce(){

  }

  // 门店
  selectShop(){
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '您是否将门店(' + this.storeInfo.companyName + ')设置为保单收件地址？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.consigneeMsg.consigneeAddress = this.storeInfo.companyAddress;
          }
        }
      ]
    });
    alert.present();
  }

}
