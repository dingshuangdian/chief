
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { CsModal } from '../../../../providers/cs-modal';

@Component({
  selector: 'page-member-recharge',
  templateUrl: 'member-recharge.html',
})
export class memberRechargePage {
  @ViewChild('mobileNumber') input;
  img_path: string;
  mobileNumber: any;//手机号码
  notifys: any;//备注
  noticeFlag: boolean = true;
  notifyTags: number = 0;//短信通知方式结果参数
  memberInfo = { mcardNo: '', mcardId: '' }
  carInfo = { mcard: { svcList: [] } };
  mcard2svc = [];
  showInput: boolean = false;
  items = [{ name: '不叠加有效期', select: true },
  { name: '设为长久', select: false },
  { name: '叠加有效期', select: false }
  ]
  postCar = {
    mcardId: '',
    orderAmount: "",
    payments: [{ money: 0, paymentId: '' }],
    rechargeAmount: "",
    validityMonth: 0,
    notifyTags: 0,
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public websites: WebSites,
    private csbzNave: CsbzNave,
    private toastCtrl: ToastController,
    private csModal: CsModal) {
    this.img_path = WebConfig.img_path;
    if (this.navParams.get('memberInfo')) {
      this.memberInfo = this.navParams.get('memberInfo');
    }
  }
  ionViewDidLoad() {
    this.getfindMcard(this.memberInfo.mcardId);

  }
  selectPay(type) {
    this.postCar.payments[0].paymentId = type.paymentId;
  }
  getfindMcard(mcardId) {
    let params = { mcardId: mcardId }
    this.websites.httpPost("findMcardById", params,true).subscribe(res => {
      if (res) {
        this.carInfo = res;
        this.mobileNumber = res.mcard.mobileNumber;
        if (this.carInfo.mcard.svcList) {
          if (this.carInfo.mcard.svcList.length > 0) {
            this.carInfo.mcard.svcList.forEach(element => {
              element.rechargeSvcNum = 0;
            });
          }
        }
        // notifys
        this.notifys = res.notifys;
        if (this.notifys) {
          if (this.notifys.length == 2) {
            this.notifys[0].flag = false;
            this.notifys[1].flag = true;
            this.notifyTags = this.notifyTags ^ this.notifys[1].notifyTag;
          } else if (this.notifys.length == 1) {
            if (this.notifys[0].notifyTag == 1 && !this.mobileNumber) {
              this.notifys[0].flag = false;
            } else {
              this.notifys[0].flag = true;
              this.notifyTags = this.notifyTags ^ this.notifys[0].notifyTag;
            }
          }
         
        }
      }
    })
  }
  //选择通知方式
  noticeWay(tag, index) {
    if (tag == 1 && !this.mobileNumber) {
      this.noticeFlag = false;
    } else {
      this.notifys[index].flag = !this.notifys[index].flag;
      this.notifyTags = this.notifyTags ^ tag;
    }
  }
  //监听手机号码
  btnActive(e) {
    if (!e) return;
    for (let i = 0; i < this.notifys.length; i++) {
      if (this.notifys[i].notifyTag == 1) {
        if ((/^1(3|4|5|7|8|9)\d{9}$/.test(e))) {
          this.mobileNumber = e;
          this.notifys[i].flag = true;
          if ((this.notifyTags & this.notifys[i].notifyTag) != this.notifys[i].notifyTag) {
            this.notifyTags = this.notifyTags ^ this.notifys[i].notifyTag;
          }
        } else {
          this.mobileNumber = '';
          this.notifys[i].flag = false;
          if ((this.notifyTags & this.notifys[i].notifyTag) == this.notifys[i].notifyTag) {
            this.notifyTags = this.notifyTags ^ this.notifys[i].notifyTag;
          }
        }
        break;
      }
    }
  }
  inputChange() {
    let ddd = 0;
    if (this.carInfo.mcard.svcList && this.carInfo.mcard.svcList.length > 0) {
      this.carInfo.mcard.svcList.forEach(element => {
        ddd = ddd + element.svcPrice * element.rechargeSvcNum;
      });
    }
    ddd = ddd + Number(this.postCar.rechargeAmount);
    this.postCar.orderAmount = ddd.toString();
  }
  postRecharge() {
    this.mcard2svc = [];
    this.postCar.mcardId = this.memberInfo.mcardId;
    this.postCar.payments[0].money = Number(this.postCar.orderAmount);
    this.postCar.notifyTags = this.notifyTags;
    if (this.carInfo.mcard.svcList && this.carInfo.mcard.svcList.length > 0) {
      this.carInfo.mcard.svcList.forEach(element => {
        if (element.rechargeSvcNum > 0) {
          let mcardsvc = { serviceId: '', rechargeSvcNum: 0 };
          mcardsvc.serviceId = element.serviceId;
          mcardsvc.rechargeSvcNum = element.rechargeSvcNum;
          this.mcard2svc.push(mcardsvc);
        }
      });
    }
    if (this.mcard2svc.length > 0) {
      this.postCar['mcard2svc'] = this.mcard2svc;
    }
    this.websites.httpPost('rechargeMcard', this.postCar).subscribe(res => {
      if (res) {
        this.presentToast(res.msg);
        this.navCtrl.pop();
      }


    }, err => {
      // this.presentToast(err.body.msg);
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
  selectName(i) {

    this.items.forEach(element => {
      element.select = false;
    });
    i.select = true;
    if (i.name == "叠加有效期") {
      this.showInput = true;
    } else if (i.name == "设为长久") {
      this.showInput = false;
      this.postCar.validityMonth = 500;
    } else {
      this.showInput = false;
      this.postCar.validityMonth = 0;
    }
  }
}

