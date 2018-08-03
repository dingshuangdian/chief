
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { ConsumerMsgPage } from '../consumer-msg/consumer-msg';
import { CsModal } from '../../../../providers/cs-modal';
@Component({
  selector: 'page-new-custom',
  templateUrl: 'new-custom.html',
})
export class newCustomPage {
  gender;
  classic;
  public isNewCustomer: boolean = true;
  callback;
  isInist: boolean = false;
  consumerT;
  mobilePhone;
  consumerr = { headImg: '', memberName: '', mobileNumber: '', memberSex: 1, memo: '', memberId: '', memberTypeId: 0 };
  postCar = {
    memberName: '',
    memberSex: 1,
    memberTypeId: 0,
    memo: '',
    memberId: '',
    mobileNumber: '',

  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public changeDetectorRef: ChangeDetectorRef, public csbzNave: CsbzNave, public toastCtrl: ToastController, public alertCtrl: AlertController, public showToast: CsModal) {
    this.callback = this.navParams.get('callback');
    if (this.navParams.get('consumer')) {

      this.consumerT = '客户编辑';
      this.consumerr = this.navParams.get('consumer');
      if (this.consumerr.memo == null) {
        this.consumerr.memo = '';
      }
      this.mobilePhone = this.consumerr.mobileNumber;
      this.postCar.memberSex = this.consumerr.memberSex;
      this.postCar.memberTypeId = this.consumerr.memberTypeId;
      this.postCar.memberId = this.consumerr.memberId;
      if (this.consumerr.memberSex == 1) {
        this.gender = 'f';
      } else if (this.consumerr.memberSex == 0) {
        this.gender = 'm';
      } else {
        this.gender = 'f'
      }
      if (this.consumerr.memberTypeId == 0) {
        this.classic = 'g';
      } else if (this.consumerr.memberTypeId == 1) {
        this.classic = 'd';
      } else {
        this.classic = 'g'
      }
    } else {
      this.consumerT = '新增客户';
    }
  }
  ionViewDidLoad() {
  }
  changeSex() {
    if (this.gender == 'f') {
      this.consumerr.memberSex = 1;
      this.postCar.memberSex = this.consumerr.memberSex;
    } else if (this.gender == 'm') {
      this.consumerr.memberSex = 0;
      this.postCar.memberSex = this.consumerr.memberSex;
    }
  }
  changeClassic() {
    if (this.classic == 'g') {
      this.consumerr.memberTypeId = 0;
      this.postCar.memberTypeId = this.consumerr.memberTypeId;
    } else if (this.classic == 'd') {
      this.consumerr.memberTypeId = 1;
      this.postCar.memberTypeId = this.consumerr.memberTypeId;
    }


  }
  toMsg() {
    this.postCar.memberName = this.consumerr.memberName;
    if (this.mobilePhone) {
      this.postCar.mobileNumber = this.mobilePhone;
    } else {
      this.postCar.mobileNumber = '';
    }

    this.postCar.memo = this.consumerr.memo;
    if (this.isInist) {
      this.presentAlert('电话号码' + this.mobilePhone + "已存在");
      return;
    }
    if (this.mobilePhone) {
      if (!this.csbzNave.checkTelephone(this.mobilePhone)) {
        this.presentAlertName("手机号码格式不正确");
        return;
      };
    }
    if (this.consumerr.memberName == null || this.consumerr.memberName == '') {
      this.presentAlertName("请填写客户姓名");
      return;
    }
    this.websites.httpPost('saveMember', this.postCar).subscribe(res => {
      if (res) {
        if (this.callback) {
          this.callback().then(() => {
            this.navCtrl.pop();
          })
        } else {
          this.navCtrl.push(ConsumerMsgPage, { res: res });
        }
      }
    }, error => {
      // this.showToast.showToast(error.body.msg);
    })
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
  changeMobileNumber() {

    if (this.csbzNave.checkTelephone(this.mobilePhone)) {
      let params = { mobileNumber: this.mobilePhone };
      this.websites.httpPost('getMemberDetailedByTel', params, false).subscribe(res => {
        if (res) {
          this.presentAlert('电话号码' + this.mobilePhone + "已存在");
        }
      })
    } else {
      this.isInist = false;
    }
  }


  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '确定',
          handler: () => {

            this.isInist = true;
          }

        },
      ]
    });
    alert.present();
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

