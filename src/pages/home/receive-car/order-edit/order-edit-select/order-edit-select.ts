import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../../../providers/web-sites';


/**
 * Generated class for the receiveCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-edit-select',
  templateUrl: 'order-edit-select.html',
})
export class OrderEditSelectPage {
  rightName: any;
  callback;
  singleType;

  leftCate: any[] =

    [
      { "leftTitle": "全部" },
      { "leftTitle": "接车员" },
      { "leftTitle": "美容工" },
      { "leftTitle": "维修工" },
      { "leftTitle": "轮胎工" },
      { "leftTitle": "采购员" },
      { "leftTitle": "仓管员" },
      { "leftTitle": "收营员" },
    ];  /*左侧分类数据*/

  staff: any = [];
  single: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites) {
    this.callback = this.navParams.get('callback');

    this.singleType = this.navParams.get('flagType');

    this.staff = this.navParams.get('list') || [];

    this.getRightData();
  }
  ionViewDidLoad() {
  }

  selectPo(i) {
    this.leftCate.forEach(element => {
      element.select = false;
    });
    i.select = true;
  }
  finish() {
    let staff = [];
    this.rightName.forEach(e => {
      if (e.select) {
        let single: any = {};
        single.staffUid = e.userId;
        single.userName = e.userName;

        staff.push(single);
      }
    });

    this.callback(staff).then(() => {
      this.navCtrl.pop();
    })

  }

  selectName(i) {
    if (this.singleType) {
      this.callback(i).then(() => {
        this.navCtrl.pop();
      })
    } else {
      i.select = !i.select;
    }
  }
  getRightData() {
    this.websites.httpPost("findAllStoreUser",{}).subscribe(res => {
      if (res) {
        res.forEach(e => {
          e.select = false;
          this.staff.forEach(s => {
            if (s.staffUid == e.userId)
              e.select = true;
          });
        });
        this.rightName = res;
      }
    }, error => {
      console.error(error);
    })

  }
}


