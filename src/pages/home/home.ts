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
import { AutoInsurancePage } from './auto-insurance/auto-insurance';

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
  InsuranceList: any = { records: "0", expireDate: "" }
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
      { name: "库存查询", img: "home_24.png", tag: 6 }
    ];
    this.RSData.loadPermissionCode(() => {
      this.RSData.cxCode().then((msg) => {
        $this.itemList.splice(3, 0, { name: "车险业务", img: "home_09.png", tag: 7 });

      }, (msg) => { });
    });
    this.csbzNave.pushLis();

  }
  ionViewDidEnter() {
    this.csbzNave.appUpdate();
    //this.csbzNave.getRegistrationID();
  }
  ionViewWillEnter() {
    this.userData.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.userInfo['headImg'] = 'assets/imgs/6667_03.png';
    })
    this.websize.httpPost('getTodayIncrement', '').subscribe(res => {
      if (res) {
        this.tipMsg = res;
      }
    })
    this.websize.httpPost('getBookOrdersCount', '').subscribe(res => {
      if (res) { this.bookCount = res; }
    })
    this.websize.httpPost('getExpireInsuranceList', {}).subscribe(res => {
      if (res) {
        this.InsuranceList.records = res.records;
        this.InsuranceList.expireDate=res.rows[0].expireDate;
      }
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
    this.RSData.JdPCode('203002', "1", "203007", "2", "203007", "4").then((msg) => {
      this.navCtrl.push(memberMngPage);
    }, (msg) => { })

  }
  onCustom() {
    this.RSData.JdPCode("204001", "1", "204002", "1").then((msg) => {
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
    this.navCtrl.push(AutoInsurancePage);
    // cordova.BSTool.pushBSView({ "tokenId": this.userData.getToken(), "home": 1 }, (res) => {
    //   console.log(res);
    // }, (error) => {
    //   console.log(error);
    // })
  }
  // test(){
  //   this.navCtrl.push(ReservationListPage);
  // }
  // test1(){
  //   this.navCtrl.push(PaymentPolicyPage);
  // }
  // test2(){
  //   this.navCtrl.push(SelInsuranceCompPage);
  // }
}
