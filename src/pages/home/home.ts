import { Component } from '@angular/core';
import { NavController, NavParams, Events, IonicApp, IonicModule, Platform } from 'ionic-angular';

import { receiveCarPage } from './receive-car/receive-car';

import { UserData } from '../../providers/user-data'
import { memberMngPage } from './member-mng/member-mng';
import { customPage } from './custom/custom';
import { appointmentMngPage } from './appointment-mng/appointment-mng';
import { RecordPage } from './record/record';
import { BusinessRemindPage } from './business-remind/business-remind';
import { WebSites } from '../../providers/web-sites';
import { resourcesStaticProvider } from '../../providers/resources-static';
import { CsbzNave } from '../../providers/csbz-nave';
import { CheckHelpPage } from './check-help/check-help';
import { JPush } from '@jiguang-ionic/jpush';




/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare let cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public registrationId: string;
  sequence: number = 0;
  userInfo = [{ userMobile: '', userName: '' }]
  bookCount = { bookCount: 0 };
  tipMsg = { mcCount: '0', autoCount: '0', memberCount: '0', wxCount: '0', };

  itemList: any = [];
  unreadMsg: string = "0";
  InsuranceList: any = { records: "", expireDate: "" }

  tagResultHandler = function (result) {
    var sequence: number = result.sequence;
    var tags: Array<string> = result.tags == null ? [] : result.tags;
    alert(
      "Success!" + "\nSequence: " + sequence + "\nTags: " + tags.toString()
    );
  };

  aliasResultHandler = function (result) {
    var sequence: number = result.sequence;
    var alias: string = result.alias;
    alert("Success!" + "\nSequence: " + sequence + "\nAlias: " + alias);
  };

  errorHandler = function (err) {
    var sequence: number = err.sequence;
    var code = err.code;
    alert("Error!" + "\nSequence: " + sequence + "\nCode: " + code);
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public websize: WebSites,
    public platform: Platform,
    public jpush: JPush,
    public event: Events,
    public RSData: resourcesStaticProvider,
    private csbzNave: CsbzNave) {
    let $this = this;
    $this.itemList = [
      { name: "接车", img: "home_03.png", tag: 0 },
      { name: "预约管理", img: "home_05.png", tag: 1 },
      { name: "会员管理", img: "home_07.png", tag: 2 },
      { name: "业务提醒", img: "home_16.png", tag: 3 },
      { name: "记一笔", img: "home_19.png", tag: 4 },
      { name: "客户查询", img: "home_22.png", tag: 5 },
      { name: "查询助手", img: "home_24.png", tag: 6 }
    ];
    this.RSData.loadPermissionCode(() => {
      this.RSData.cxCode().then((msg) => {
        $this.itemList.splice(3, 0, { name: "车险业务", img: "home_09.png", tag: 7 });
        $this.websize.httpPost('getExpireInsuranceList', {}, false).subscribe(res => {
          if (res) {
            this.InsuranceList.records = res.records;
            if (res.rows && res.rows.length > 0) {
              this.InsuranceList.expireDate = res.rows[0].expireDate;
            }
          }
        })
        $this.websize.httpPost('queryUnreadMsg', {}, false).subscribe(res => {
          if (res) {
            this.unreadMsg = res.unreadMsg;
          }
        });
      }, (msg) => { });
    });
    document.addEventListener(
      "jpush.receiveNotification",
      (event: any) => {
        var content;
        if (platform.is('Android')) {
          content = event.alert;
        } else {
          content = event.aps.alert;
        }
        // alert("Receive notification: " + JSON.stringify(event));
      },
      false
    );

    document.addEventListener(
      "jpush.openNotification",
      (event: any) => {
        var content;

        if (platform.is('Android')) {
          content = event.alert;
        } else {
          // iOS
          if (event.aps == undefined) {
            // 本地通知
            content = event.content;
          } else {
            // APNS
            content = event.aps.alert;
          }
        }
        //alert("open notification: " + JSON.stringify(event));
      },
      false
    );

    document.addEventListener(
      "jpush.receiveLocalNotification",
      (event: any) => {
        // iOS(*,9) Only , iOS(10,*) 将在 jpush.openNotification 和 jpush.receiveNotification 中触发。
        var content;
        if (platform.is('Android')) {
        } else {
          content = event.content;
        }
        //alert("receive local notification: " + JSON.stringify(event));
      },
      false
    );
  }


  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      this.registrationId = rId;
      //console.log(this.registrationId);
    });
  }

  setTags() {
    this.jpush
      .setTags({ sequence: this.sequence++, tags: ["Tag1", "Tag2"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  addTags() {
    this.jpush
      .addTags({ sequence: this.sequence++, tags: ["Tag3", "Tag4"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  checkTagBindState() {
    this.jpush
      .checkTagBindState({ sequence: this.sequence++, tag: "Tag1" })
      .then(result => {
        var sequence = result.sequence;
        var tag = result.tag;
        var isBind = result.isBind;
        alert(
          "Sequence: " + sequence + "\nTag: " + tag + "\nIsBind: " + isBind
        );
      })
      .catch(this.errorHandler);
  }

  deleteTags() {
    this.jpush
      .deleteTags({ sequence: this.sequence++, tags: ["Tag4"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  getAllTags() {
    this.jpush
      .getAllTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  cleanTags() {
    this.jpush
      .cleanTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  setAlias() {
    this.jpush
      .setAlias({ sequence: this.sequence++, alias: "TestAlias" })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  getAlias() {
    this.jpush
      .getAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  deleteAlias() {
    this.jpush
      .deleteAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  addLocalNotification() {
    if (this.platform.is('Android')) {
      this.jpush.addLocalNotification(0, "Hello JPush", "JPush", 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, "Hello JPush", 1, "localNoti1");
    }
  }
  ionViewDidEnter() {
    this.csbzNave.appUpdate();
  }

  ionViewWillEnter() {
    this.userData.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.userInfo['headImg'] = 'assets/imgs/6667_03.png';
    })

    this.websize.httpPost('getTodayIncrement', '', false).subscribe(res => {
      if (res) {
        this.tipMsg = res;
      }
    })

    this.websize.httpPost('getBookOrdersCount', '', false).subscribe(res => {
      if (res) { this.bookCount = res; }
    })

  }


  itemClick(tag) {
    switch (tag) {
      case 0:
        this.onSignup();
        break;
      case 1:
        this.onAppointmentMng();
        break;
      case 2:
        this.onMemberMng();
        break;
      case 3:
        this.onBusinessRemind();
        break;
      case 4:
        this.onRecord();
        break;
      case 5:
        this.onCustom();
        break;
      case 6:
        this.onCheckHelp()
        break;
      case 7:
        this.onCX();
        break;
    }
  }



  onSignup() {
    this.RSData.JdPCode("202003", "2", "202004").then((msg) => {
      this.navCtrl.push(receiveCarPage);
    }, (msg) => { })
  }
  onMemberMng() {
    this.RSData.JdPCode('203001', "1").then((msg) => {
      this.navCtrl.push(memberMngPage);
    }, (msg) => { })

  }
  onCustom() {
    this.RSData.JdPCode("204001", "1").then((msg) => {
      this.navCtrl.push(customPage);
    }, (msg) => { })
  }
  onAppointmentMng() {
    this.RSData.JdPCode("202001", "1").then((msg) => {
      this.navCtrl.push(appointmentMngPage);
    }, (msg) => { });
  }
  onRecord() {
    this.RSData.JdPCode("208001", "3").then((msg) => {
      this.navCtrl.push(RecordPage);
    }, (msg) => {

    });
  }
  onBusinessRemind() {
    this.navCtrl.push(BusinessRemindPage);
  }
  onCheckHelp() {
    this.navCtrl.push(CheckHelpPage);
  }
  toReceiveCar() {
    this.RSData.JdPCode("202003", "2", "202004").then((msg) => {
      this.navCtrl.push(receiveCarPage);
    }, (msg) => { })
  }
  onCX() {
    cordova.BSTool.pushBSView({ "tokenId": this.userData.getToken(), "home": 1 }, (res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }

}
