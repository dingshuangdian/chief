import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { ProblemAnswerPage } from './problem-answer/problem-answer';
import { AboutChiefPage } from './about-chief/about-chief';
import { WebSites } from '../../providers/web-sites';
import { CsbzNave } from '../../providers/csbz-nave';
import { WebConfig } from '../../providers/web-config';

declare let CMInfo: any;

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  userInfo = [{ userName: '', userMobile: '' }]
  storeMsg = {
    company_name: '',
    store_address: '',
    office_tel: '',
    business_time: '',
    storeBrand: '',
  }
  versionName: string = "";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public alertCtrl: AlertController,
    public websize: WebSites,
    public events: Events,
    private csbzNave: CsbzNave) {
    this.userData.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.userInfo['headImg'] = 'assets/imgs/6667_03.png';
    });

    if (window["CMInfo"]) {
      this.versionName = CMInfo.appVersionName;
    }


  }
  ionViewDidLoad() {
    this.websize.httpPost('getStoreInfo', '').subscribe(res => {
      if (res) {
        this.storeMsg = res;

        console.log(this.storeMsg);
      }

    })
  }
  ngOnInit() {

  }
  //疑问解答
  gotoQuestion() {
    this.navCtrl.push(ProblemAnswerPage);
  }
  //关于车仆
  gotoChief() {
    this.navCtrl.push(AboutChiefPage);
  }
  //客服电话
  callPhone() {
    let alertCall = this.alertCtrl.create({
      title: '拨打客服电话',
      subTitle: '4008313400',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确认',
          handler: () => {
            window.open('tel:' + WebConfig.phone);
          }
        }
      ]
    });
    alertCall.present();
  }
  //检测版本
  checkVersion() {
    this.csbzNave.appUpdate(true);
  }
  //退出登录

  logout() {
    // this.userData.logout();

    let alertLogout = this.alertCtrl.create({
      subTitle: '确定注销当前用户吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确认',
          handler: () => {
            this.websize.httpPost("loginOut", {}).subscribe(res => {
              this.events.publish('user:logout');
            })

          }
        }
      ]
    });
    alertLogout.present();

  }
}
