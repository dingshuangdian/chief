import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

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

  userInfo = [{ userMobile: '', userName: '' }]
  bookCount = { bookCount: 0 };
  tipMsg = { mcCount: '0', autoCount: '0', memberCount: '0', wxCount: '0', };

  itemList: any = [];
  unreadMsg: string = "0";
  InsuranceList: any = { records: "", expireDate: "" }


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public websize: WebSites,
    public event: Events,
    public RSData: resourcesStaticProvider,
    private csbzNave: CsbzNave) {
    let $this = this;
    this.RSData.loadPermissionCode(() => {
      $this.itemList = [
        { name: "接车", img: "home_03.png", tag: 0 },
        { name: "预约管理", img: "home_05.png", tag: 1 },
        { name: "会员管理", img: "home_07.png", tag: 2 },
        { name: "业务提醒", img: "home_16.png", tag: 3 },
        { name: "记一笔", img: "home_19.png", tag: 4 },
        { name: "客户查询", img: "home_22.png", tag: 5 },
        { name: "查询助手", img: "home_24.png", tag: 6 }
      ];

      $this.RSData.JdPCode("hasInsur", false).then((msg) => {
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
        })
      }, (msg) => { })
    });
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
    this.RSData.JdPCode("receiveCarMenu").then((msg) => {
      this.navCtrl.push(receiveCarPage);
    }, (msg) => { })
  }
  onMemberMng() {
    this.navCtrl.push(memberMngPage);
  }
  onCustom() {
    this.RSData.JdPCode("storeMemberMenu").then((msg) => {
      this.navCtrl.push(customPage);
    }, (msg) => { })
  }
  onAppointmentMng() {
    this.RSData.JdPCode("reservationMenu").then((msg) => {
      this.navCtrl.push(appointmentMngPage);
    }, (msg) => { });

  }
  onRecord() {
    this.navCtrl.push(RecordPage);
  }
  onBusinessRemind() {
    this.navCtrl.push(BusinessRemindPage);
  }
  onCheckHelp() {
    this.navCtrl.push(CheckHelpPage);
  }
  toReceiveCar() {
    this.navCtrl.push(receiveCarPage);
  }
  onCX() {
    // cordova.BSTool.pushBSView({ "lgiName": this.userData.getLgiName(), "lgiPwd": this.userData.getLgiPwd(), "firstType": 1 }, (res) => {
    //   console.log(res);
    // }, (error) => {
    //   console.log(error);
    // })

    this.RSData.JdPCode("hasInsur").then((msg) => {
      cordova.BSTool.pushBSView({ "tokenId": this.userData.getToken(), "home": 1 }, (res) => {
        console.log(res);
      }, (error) => {
        console.log(error);
      })
    }, (msg) => { });


  }
}
