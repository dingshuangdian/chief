import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';
import { OrderEditSelectPage } from '../../receive-car/order-edit/order-edit-select/order-edit-select';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { CsModal } from '../../../../providers/cs-modal';
import { DatePipe } from '@angular/common';
import { memberOpenSuccessPage } from '../member-open-success/member-open-success';


@Component({
  selector: 'page-member-open-certain',
  templateUrl: 'member-open-certain.html'
})
export class memberOpenCertainPage {

  memberInfo = {
    memberName: '',
    mobileNumber: '',
    plateNumber: '',
    memberId: ''
  }

  carInfo: any = { plateNB: '', provinces: '', autotypeName: "请选择车型" };

  salecard;

  salecardDetail: any = { mcard2svc: [], mcardDesc: '' }

  img_path: string;

  otherInfor = { totalPrice: 0, stopDate: "", mcardNo: "" };

  saleInfo: any = { userId: "" };

  payment: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public websites: WebSites,
    public csbzNave: CsbzNave,
    private csModal: CsModal,
    private datePipe: DatePipe) {
    this.img_path = WebConfig.img_path;
    this.memberInfo = this.navParams.get("memberInfo");
    this.salecard = this.navParams.get("salecard");
    this.carInfo = this.navParams.get("carInfo");
  }

  ionViewDidLoad() {
    this.findmcardtmpl();
  }

  findmcardtmpl() {
    this.websites.httpPost('findmcardtmpl', { mcardtmplId: this.salecard.mcardtmplId }).subscribe(res => {
      if (res) {
        this.salecardDetail = res;
        this.validityMonthChange();
        if (this.salecardDetail.mcard2svc) {
          this.methodSinglePrice();
        }
      }

    })
  }

  inputChange() {
    this.methodSinglePrice();
  }

  selectPay(type) {
    this.payment = type;
  }

  selectSaleU() {
    let $this = this;
    let demo = function (sale) {
      return new Promise((resolve) => {
        $this.saleInfo = sale;
        resolve();
      })
    }

    this.navCtrl.push(OrderEditSelectPage, {
      callback: demo,
      flagType: true
    });
  }

  methodSinglePrice() {
    this.otherInfor.totalPrice = 0;
    this.salecardDetail.mcard2svc.forEach(m => {
      if (m.isInfinite == 1) {
        m.totalAmount = 365 * m.svcPrice;
      } else {
        m.totalAmount = m.svcNum * m.svcPrice;
      }

      this.otherInfor.totalPrice += m.totalAmount;
    });
  }

  validityMonthChange() {
    let validityMonth = this.salecardDetail['validityMonth'] ? this.salecardDetail['validityMonth'] : 0;

    if (validityMonth == 0) {
      this.otherInfor.stopDate = "";
    } else {
      let date = this.csbzNave.ionDateTool(new Date(), validityMonth, 'm');
      this.otherInfor.stopDate = this.datePipe.transform(date, "yyyy-MM-dd");
    }

  }

  dateChange() {
    let nowDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    if (this.otherInfor.stopDate <= nowDate) {
      this.salecardDetail['validityMonth'] = "";
    } else {
      var d1 = new Date(this.otherInfor.stopDate);
      var d2 = new Date();
      let days = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth())

      if (days == 0) {
        this.salecardDetail['validityMonth'] = "以截止日期为准";
      } else {
        this.salecardDetail['validityMonth'] = days;
      }
    }
  }


  certain() {
    if (typeof this.salecardDetail.validityMonth == "string" && this.salecardDetail.validityMonth.length == 0) {
      this.csModal.showToast("请输入正确的有效期");
      return;
    }

    this.csModal.showAlert("请确认开卡信息，套餐总价" + this.otherInfor.totalPrice + "元，卡内金额" + this.salecardDetail.mcardBalance + "元，售价" + this.salecardDetail.mcardPrice + "元",
      () => {

        let pamras: any = this.salecardDetail || {};
        let member: any = {};
        member.memberId = this.memberInfo.memberId;
        member.memberName = this.memberInfo.memberName;
        member.mobileNumber = this.memberInfo.mobileNumber;

        let paytype: any = {};
        paytype.money = this.salecardDetail.mcardPrice;
        paytype.paymentId = this.payment.paymentId;

        pamras.member = member;
        pamras.auto = this.carInfo;
        pamras.mcardNo = this.otherInfor.mcardNo;
        pamras.saleUid = this.saleInfo.userId;
        pamras.orderAmount = this.salecardDetail.mcardPrice;
        pamras.mcardDesc = this.salecardDetail.mcardDesc || '';
        pamras.payments = [];
        pamras.payments.push(paytype);

        if (this.salecardDetail.validityMonth == 0) {
          pamras.stopDate = "";
        } else {
          let dd = new Date(this.otherInfor.stopDate);
          pamras.stopDate = this.datePipe.transform(dd, 'yyyy-MM-dd');
        }

        // this.navCtrl.push(memberOpenSuccessPage, { memberInfo: this.memberInfo, mcardNo: "80061" });
        this.websites.httpPost("addCard", pamras).subscribe(res => {
          if (res) {
            this.navCtrl.push(memberOpenSuccessPage, { memberInfo: res, mcardNo: res.mcardNo });
          }
        })
      }, () => {

      })
  }

}

