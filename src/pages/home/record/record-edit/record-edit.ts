import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { RecordPageRegistere } from '../record-registere/record-registere';

/**
 * Generated class for the RecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-record-edit',
  templateUrl: 'record-edit.html',
})
export class RecordPageEdit {
  public courseTab = [
    { "name": "收入", "bol": true },
    { "name": "支出", "bol": false }
  ];
  classic;
  tabname = '收入';
  typeName;
  callback;
  divType = { journalTypeName: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, public webSise: WebSites, private alertCtrl: AlertController) {
    this.callback = navParams.get('callback');
  }
  ionViewDidLoad() {
    this.getClassic();
  }
  getClassic() {
    this.webSise.httpPost('findSingleBillType', '').subscribe(res => {
      this.classic = res;
    })
  }
  toggleTab(item, list) {
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
      if (item == list[i].name) {
        list[i].bol = true;
        this.tabname = list[i].name;
      }
    }
  }
  editDiv() {

    if (this.typeName == null || this.typeName == "") {
      this.presentAlertName("请填写新类型");
      return;
    }
    this.divType.journalTypeName = this.typeName;
    this.navCtrl.push(RecordPageRegistere, { classic: this.divType, tabName: this.tabname, callback: this.callback });
  }
  goRecordRegister(type) {
    this.navCtrl.push(RecordPageRegistere, { classic: type, tabName: this.tabname, callback: this.callback });
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
