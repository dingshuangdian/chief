
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
    validityMonth: 0
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
    this.websites.httpPost("findMcardById", params).subscribe(res => {
      if (res) {
        this.carInfo = res;
        if (this.carInfo.mcard.svcList) {
          if (this.carInfo.mcard.svcList.length > 0) {
            this.carInfo.mcard.svcList.forEach(element => {
              element.rechargeSvcNum = 0;
            });
          }
        }
      }
    })
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

