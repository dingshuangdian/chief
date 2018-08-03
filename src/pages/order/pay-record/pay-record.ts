import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-pay-record',
  templateUrl: 'pay-record.html',
})
export class PayRecordlPage {
  membrId;
  autoId;
  selectOption = 'all';
  page = 1;
  plateNumber;
  payRecord = [];
  mrPayRecord = [];
  byPayRecord = [];
  wxPayRecord = [];
  gzPayRecord = [];
  ltPayRecord = [];
  qtPayRecord = [];
  bpPayRecord = [];
  otherPayRecord = [];
  infiniteScroll;
  constructor(public navCtrl: NavController, public navParams: NavParams, public Websites: WebSites) {
    this.membrId = this.navParams.get('memberId');
    this.autoId = this.navParams.get('autoId');
    this.plateNumber = this.navParams.get('plateNumber');
  }

  ionViewDidLoad() {
    this.switchType();
  }
  doLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.getPayRecordList(this.infiniteScroll);
  }
  getPayRecordList(infiniteScroll) {
    let params = { membrId: this.membrId, autoId: this.autoId, row: 15, page: this.page };
    this.Websites.httpPost('findOrderLogs', params, false).subscribe(res => {
      if (res) {
        if (this.selectOption == 'mr') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 1) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.mrPayRecord.push(a);
                  }
                }
              });
            }
          });



          this.mrPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.mrPayRecord);
          this.mrPayRecord = [];
        }
        if (this.selectOption == 'by') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 2) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.byPayRecord.push(a);
                  }
                }
              });
            }
          });
          this.byPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.byPayRecord);
          this.byPayRecord = [];
        }
        if (this.selectOption == 'wx') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 3) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.wxPayRecord.push(a);
                  }
                }
              });
            }
          });
          this.wxPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.wxPayRecord);
          this.wxPayRecord = [];
        }
        if (this.selectOption == 'gz') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 4) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.gzPayRecord.push(a);
                  }
                }
              });
            }
          });
          this.gzPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.gzPayRecord);
          this.gzPayRecord = [];
        }
        if (this.selectOption == 'lt') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 5) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.ltPayRecord.push(a);
                  }
                }
              });
            }
          });
          this.ltPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.ltPayRecord);
          this.ltPayRecord = [];
        }
        if (this.selectOption == 'other') {
          res.forEach(element => {
            let a;
            if (element.services) {
              element.services.forEach(elementt => {
                if (elementt.svctypePId == 6) {
                  if (a) {
                    a.newService.push(elementt);
                  } else {
                    a = element;
                    a.newService = [];
                    a.newService.push(elementt);
                    this.otherPayRecord.push(a);
                  }
                }
              });
            }
          });
          this.otherPayRecord.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecord = this.payRecord.concat(this.otherPayRecord);
          this.otherPayRecord = [];
        }
        if (this.selectOption == 'all') {

          this.payRecord = this.payRecord.concat(res);
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
          if (res.length < 15) {
            infiniteScroll.enable(false);
          }
        };
        this.page++;
      }
    }, error => {
      console.error(error);
    })
  }
  switchType() {
    this.page = 1;
    this.payRecord = [];
    this.mrPayRecord = [];
    this.byPayRecord = [];
    this.wxPayRecord = [];
    this.gzPayRecord = [];
    this.ltPayRecord = [];
    this.qtPayRecord = [];
    this.bpPayRecord = [];
    this.otherPayRecord = [];
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
    this.getPayRecordList('');
  }
}


