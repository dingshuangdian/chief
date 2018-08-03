import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { RecordPage } from '../record';

/**
 * Generated class for the RecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-record-registere',
  templateUrl: 'record-registere.html',
})
export class RecordPageRegistere {
  type;
  tabName;
  callback;
  postOrder = {
    journalTypeName: '', journalTypeId: '', isIncome: '', journalAmount: '', settleDate: '', memo: "", payments: [{
      paymentId: "",
      money: ""
    }]
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public webSise: WebSites, public alertCtrl: AlertController) {
    this.type = navParams.get('classic');
    this.tabName = navParams.get('tabName');
    this.callback = navParams.get('callback');
  }
  ionViewDidLoad() {
    if (this.tabName == '收入') {
      this.postOrder.isIncome = '1';
    } else if (this.tabName == '支出') {
      this.postOrder.isIncome = '0';
    }
  }
  toPost() {
    if (this.postOrder.journalAmount == null || this.postOrder.journalAmount == '') {
      this.presentAlertName("请填写金额");
      return;
    }
    if (this.postOrder.settleDate == null || this.postOrder.settleDate == '') {
      this.presentAlertName("请选择日期");
      return;
    }
    this.postOrder.payments[0].money = this.postOrder.journalAmount;
    this.postOrder.journalTypeName = this.type.journalTypeName;
    this.postOrder.journalTypeId = this.type.journalTypeId || '';
    this.webSise.httpPost('addJournal', this.postOrder).subscribe(res => {
      if (res) {
        this.callback().then(() => {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
        })
      }
    }, err => {
    });
  }
  selectPay(type) {
    this.postOrder.payments[0].paymentId = type.paymentId;
  }
  presentAlertName(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '确定',
        },
      ]
    });
    alert.present();
  }
}
