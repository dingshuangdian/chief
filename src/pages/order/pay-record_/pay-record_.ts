import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-pay-record_',
  templateUrl: 'pay-record_.html',
})
export class PayRecordlPage_ {
  permissionData;
  showB: boolean = false;
  membrId;
  autoId;
  selectOption = 'all';
  page = 1;
  hasB;
  plateNumber;
  payRecordA = [];
  mrPayRecordA = [];
  byPayRecordA = [];
  wxPayRecordA = [];
  gzPayRecordA = [];
  ltPayRecordA = [];
  qtPayRecordA = [];
  bpPayRecordA = [];
  otherPayRecordA = [];
  payRecordB = [];
  mrPayRecordB = [];
  byPayRecordB = [];
  wxPayRecordB = [];
  gzPayRecordB = [];
  ltPayRecordB = [];
  qtPayRecordB = [];
  bpPayRecordB = [];
  otherPayRecordB = [];
  infiniteScrollA;
  infiniteScrollB;
  constructor(public navCtrl: NavController, public navParams: NavParams, public Websites: WebSites, public storage: Storage) {
    this.membrId = this.navParams.get('memberId');
    this.autoId = this.navParams.get('autoId');
    this.plateNumber = this.navParams.get('plateNumber');
    this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
    this.permissionData.forEach(element => {
      if (element.menuId == "202005") {
        if (4 == (element.funcTags & 4)) {
          this.showB = true;
        } else {
          this.showB = false;
        }
      }
    })
  }
  public courseTab = [
    { "name": "A单消费", "bol": true },
    { "name": "B单消费", "bol": false }
  ];

  ionViewDidLoad() {

    this.Websites.httpPost('findStoreExt', this.membrId).subscribe(res => {
      this.hasB = res.border;
      if (this.hasB == '1' && this.showB) {
        this.switchTypeB();
      }
    })
    this.switchTypeA();
  }
  doLoadMoreA(infiniteScroll) {
    this.infiniteScrollA = infiniteScroll;
    this.getPayRecordListA(this.infiniteScrollA);

  }
  doLoadMoreB(infiniteScroll) {
    this.infiniteScrollB = infiniteScroll;
    this.getPayRecordListB(this.infiniteScrollB);

  }
  getPayRecordListA(infiniteScroll) {
    let params = { membrId: this.membrId, autoId: this.autoId, pageSize: 15, pageNo: this.page };
    this.Websites.httpPost('findOrderLogsBymember', params, false).subscribe(res => {
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
                    this.mrPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.mrPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.mrPayRecordA);
          this.mrPayRecordA = [];
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
                    this.byPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.byPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.byPayRecordA);
          this.byPayRecordA = [];
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
                    this.wxPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.wxPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.wxPayRecordA);
          this.wxPayRecordA = [];
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
                    this.gzPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.gzPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.gzPayRecordA);
          this.gzPayRecordA = [];
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
                    this.ltPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.ltPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.ltPayRecordA);
          this.ltPayRecordA = [];
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
                    this.otherPayRecordA.push(a);
                  }
                }
              });
            }
          });
          this.otherPayRecordA.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordA = this.payRecordA.concat(this.otherPayRecordA);
          this.otherPayRecordA = [];
        }
        if (this.selectOption == 'all') {

          this.payRecordA = this.payRecordA.concat(res);

        }
        if (infiniteScroll) {
          infiniteScroll.complete();
          if (res.length < 15) {
            infiniteScroll.enable(false);
          }
        };
        this.page++;
      } else {
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
        };
      }
    }, error => {
      console.error(error);
    })
  }
  getPayRecordListB(infiniteScroll) {
    let params = { membrId: this.membrId, autoId: this.autoId, pageSize: 15, pageNo: this.page };
    this.Websites.httpPost('findOrderCopyLogs', params, false).subscribe(res => {
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
                    this.mrPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.mrPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.mrPayRecordB);
          this.mrPayRecordB = [];
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
                    this.byPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.byPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.byPayRecordB);
          this.byPayRecordB = [];
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
                    this.wxPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.wxPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.wxPayRecordB);
          this.wxPayRecordB = [];
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
                    this.gzPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.gzPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.gzPayRecordB);
          this.gzPayRecordB = [];
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
                    this.ltPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.ltPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.ltPayRecordB);
          this.ltPayRecordB = [];
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
                    this.otherPayRecordB.push(a);
                  }
                }
              });
            }
          });
          this.otherPayRecordB.forEach(mService => {
            mService['services'] = mService['newService'];
          });
          this.payRecordB = this.payRecordB.concat(this.otherPayRecordB);
          this.otherPayRecordB = [];
        }
        if (this.selectOption == 'all') {

          this.payRecordB = this.payRecordB.concat(res);

        }
        if (infiniteScroll) {
          infiniteScroll.complete();
          if (res.length < 15) {
            infiniteScroll.enable(false);
          }
        };
        this.page++;
      } else {
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
        };
      }
    }, error => {
      console.error(error);
    })
  }
  switchType() {
    if (this.courseTab[0].bol) {
      this.switchTypeA();
    } else if (this.courseTab[1].bol) {
      this.switchTypeB();
    }
  }
  switchTypeA() {
    this.page = 1;
    this.payRecordA = [];
    this.mrPayRecordA = [];
    this.byPayRecordA = [];
    this.wxPayRecordA = [];
    this.gzPayRecordA = [];
    this.ltPayRecordA = [];
    this.qtPayRecordA = [];
    this.bpPayRecordA = [];
    this.otherPayRecordA = [];
    if (this.infiniteScrollA) {
      this.infiniteScrollA.enable(true);
    }
    this.getPayRecordListA('');
  }
  switchTypeB() {
    this.page = 1;
    this.payRecordB = [];
    this.mrPayRecordB = [];
    this.byPayRecordB = [];
    this.wxPayRecordB = [];
    this.gzPayRecordB = [];
    this.ltPayRecordB = [];
    this.qtPayRecordB = [];
    this.bpPayRecordB = [];
    this.otherPayRecordB = [];
    if (this.infiniteScrollB) {
      this.infiniteScrollB.enable(true);
    }
    this.getPayRecordListB('');
  }
  toggleTab(item, list) {
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
      if (item == list[i].name) {
        list[i].bol = true;
      }
    }
  }
}


