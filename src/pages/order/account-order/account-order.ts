import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsbzNave } from '../../../providers/csbz-nave';
import { CsModal } from '../../../providers/cs-modal';
import { couponPopover } from '../../other/coupon-popover/coupon-popover';

/**
 * Generated class for the AccountOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-account-order',
  templateUrl: 'account-order.html',
})


export class AccountOrderPage {
  orderId: any;//订单id
  memberId: any;//会员id
  memberName: any;//用户名字
  plateNumber: any;//车牌号码
  mobileNumber: any;//手机号码
  orderStateName: any;//订单状态
  fillDate: any;//下单日期
  settlementTime: any;//结算时间
  orderAmount: any;//总价
  paiclUpMoney: any;//实收金额
  pointNumMoney: any;//抵扣的金额
  paidMoney: any;//本次付款
  memo: any;//备注
  warmTips: any;//温馨提示
  notifys: any;//备注
  goods: any;//配件项目
  services: any;//消费项目
  notifyTags: number = 0;//短信通知方式结果参数
  paymentRecords: any;//支付情况
  noPayMoney: number = 0;//未支付金额
  payments: any = {};//暂存支付方式
  settlementParam: any = {};//结算参数
  hangUpParam: any = {};//挂账参数
  pointBalanceNum: any;// 客户积分账户余额
  pointNum: any;// 使用的积分
  pointRatio: any;
  isNave: boolean = false;
  noticeFlag: boolean = true;
  discountAmount;
  pointConfig;
  coupon = "选择优惠卷";
  usePointNum;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public Websites: WebSites,
    public csbzNave: CsbzNave,
    public el: ElementRef,
    private csModal: CsModal,

    public alertCtrl: AlertController) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
    this.orderId = navParams.get('orderId');
  }
  ngOnInit() {
    this.reqAccount(this.orderId);
  }
  ionViewDidLoad() {
  }
  //请求结算单接口
  reqAccount(orderId) {
    this.Websites.httpPost('accountOrder', { 'orderId': orderId }, true).subscribe(res => {
      // order
      if (res) {
        let orderMsg = res.order;
        this.memberId = orderMsg.memberId;
        this.pointRatio = orderMsg.pointRatio;
        this.goods = orderMsg.goods;
        this.services = orderMsg.services;
        this.memberName = orderMsg.memberName;
        this.plateNumber = orderMsg.plateNumber;
        this.orderStateName = orderMsg.orderStateName;
        this.fillDate = orderMsg.fillDate;
        this.settlementTime = orderMsg.settlementTime;
        this.memo = orderMsg.memo;
        this.warmTips = orderMsg.warmTips;
        this.orderAmount = orderMsg.orderAmount;
        this.paiclUpMoney = orderMsg.orderAmount;
        this.noPayMoney = orderMsg.orderAmount;
        this.paidMoney = orderMsg.orderAmount;
        this.mobileNumber = orderMsg.mobileNumber;
        this.pointBalanceNum = orderMsg.pointBalanceNum;
        this.discountAmount = orderMsg.discountAmount;
        this.usePointNum = orderMsg.usePointNum;
        this.pointConfig = res.config.pointConfig;

        if (this.services) {
          for (let i = 0; i < this.services.length; i++) {
            this.services[i]['staff_isSalesman0'] = [];
            this.services[i]['staff_isSalesman1'] = [];
            if (this.services[i].staffs) {
              for (let j = 0; j < this.services[i].staffs.length; j++) {
                if (this.services[i].staffs[j].isSalesman == 0) {
                  this.services[i]['staff_isSalesman0'].push(this.services[i].staffs[j].userName);
                } else {
                  this.services[i]['staff_isSalesman1'].push(this.services[i].staffs[j].userName);
                }
              }
            } else {
              this.services[i]['staff_isSalesman0'] = null;
              this.services[i]['staff_isSalesman1'] = null;
            }
          }
        }

        // notifys
        this.notifys = res.notifys;
        if (this.notifys) {
          for (let i = 0; i < this.notifys.length; i++) {
            if (this.notifys[i].notifyTag == 1 && !this.mobileNumber) {
              this.notifys[i].flag = false;
              continue;
            }
            this.notifys[i].flag = true;
            this.notifyTags = this.notifyTags ^ this.notifys[i].notifyTag;
          }
        }
        //支付情况
        if (res.paymentRecords) {
          this.paymentRecords = res.paymentRecords;
        } else {
          this.paymentRecords = null;
        }
        this.computedMoney();
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
  //结算
  con() {
    if (new Date(Date.parse(this.fillDate)) > new Date(Date.parse(this.settlementTime))) {
      this.alertbox(1, '注意', '结算日期不能早于下单日期', '确定', '', function () { return; }, function () { });
      return;
    }
    if (this.orderAmount < this.paiclUpMoney) {
      this.alertbox(1, '注意', '实收金额不能超过总价', '确定', '', function () { return; }, function () { });
      return;
    }
    if (this.paiclUpMoney < 0 || this.paidMoney < 0) {
      this.alertbox(1, '注意', '实收金额和支付金额不能为负数', '确定', '', function () { return; }, function () { });
      return;
    }
    if (this.paiclUpMoney < this.paidMoney) {
      this.alertbox(1, '注意', '支付金额不能超过实收金额', '确定', '', function () { return; }, function () { });
      return;
    }
    if (this.payments.paymentId == 11) {//是否会员卡支付，会员卡余额要大于支付金额
      if (this.payments.mcardId == '') {
        this.alertbox(1, '注意', '请选择会员卡', '确定', '', function () { return; }, function () { });
        return;
      }
      // if (this.payments.mcardBalance < this.paidMoney) {
      //   this.alertbox(1, '注意', '会员卡余额不足', '确定', '', function () { return; }, function () { });
      //   return;
      // }
    }
    let self = this;
    self.alertbox(2, '消息', '确认结算订单吗？', '取消', '确定', function () { return; }, function () {
      self.settlementParam['orderId'] = self.orderId;
      self.settlementParam['mobileNumber'] = self.mobileNumber;
      self.settlementParam['fillDate'] = self.fillDate;
      self.settlementParam['settlementTime'] = self.settlementTime;
      self.settlementParam['paiclUpMoney'] = self.paiclUpMoney;
      self.settlementParam['paidMoney'] = self.paidMoney;
      self.settlementParam['memo'] = self.memo ? self.memo : "";
      self.settlementParam['warmTips'] = self.warmTips ? self.warmTips : "";
      self.settlementParam['notifyTags'] = self.notifyTags;
      self.settlementParam['pointNum'] = self.pointNum ? self.pointNum : "";
      let obj = self.payments.paymentId == 11 ? {
        money: self.paidMoney,
        paymentId: self.payments.paymentId,
        mcardId: self.payments.mcardId
      } : {
          money: self.paidMoney,
          paymentId: self.payments.paymentId,
        }
      self.settlementParam['payments'] = [obj];
      self.Websites.httpPost('settlementAsorder', self.settlementParam).subscribe((res) => {
        self.alertbox(1, '提示', '结算成功', '确定', '', function () {
          // self.navCtrl.push(OrderPage, {
          //   orderId: self.orderId
          // });
          if (self.isNave) {
            self.closewin();
          } else {
            self.navCtrl.pop();
          }

        }, function () { })
      }, error => {
        // let msg = error.body.msg;
        // self.alertbox(1, '提示', msg, '确定', '', function () { return; }, function () { })
      })
    })
  }
  goPay() {
    this.con();
  }
  //挂账
  hangUp() {
    if (new Date(Date.parse(this.fillDate)) > new Date(Date.parse(this.settlementTime))) {
      this.alertbox(1, '注意', '结算日期不能早于下单日期', '确定', '', function () { return; }, function () { });
      return;
    }
    let self = this;
    self.alertbox(2, '注意', '挂账金额将会汇总到该车主赊账金额中，由财务进行销账处理。本次挂账金额为' + this.noPayMoney, '取消', '确定', function () { return; }, function () {
      self.hangUpParam['orderId'] = self.orderId;
      self.hangUpParam['mobileNumber'] = self.mobileNumber;
      self.hangUpParam['fillDate'] = self.fillDate;
      self.hangUpParam['settlementTime'] = self.settlementTime;
      self.hangUpParam['memo'] = self.memo ? self.memo : '';
      self.hangUpParam['warmTips'] = self.warmTips ? self.warmTips : '';
      self.hangUpParam['notifyTags'] = self.notifyTags;
      self.Websites.httpPost('susupendedAsorder', self.hangUpParam).subscribe(
        res => {
          self.alertbox(1, '提示', '挂账成功', '确定', '', function () {
            // self.navCtrl.push(OrderPage,{
            //   orderId: self.orderId
            // });
            if (self.isNave) {
              self.closewin();
            } else {
              self.navCtrl.pop();
            }
          }, function () { })
        },
        error => {
          // let msg = error.body.msg;
          // self.alertbox(1, '提示', msg, '确定', '', function () { return; }, function () { })
        }
      )
    })
  }
  //撤回
  trunBack(obj) {
    let trunBackComfirm = this.alertCtrl.create({
      title: '消息',
      message: '确认撤销支付吗？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            return;
          }
        }, {
          text: '确定',
          handler: () => {
            let reqparam;
            if (obj.mcardId) {
              reqparam = { 'billId': obj.billId }
            } else {
              reqparam = { 'transactionId': obj.transactionId }
            }
            this.Websites.httpPost('cancelpaid', reqparam).subscribe((res) => {
              this.reqAccount(this.orderId);
            })
          }
        }
      ]
    });
    trunBackComfirm.present();
  }
  //监听实付金额变化
  changeMoney(e) {
    this.computedMoney();
  }
  changeNum(e) {
    //this.el.nativeElement.querySelector('.mal').maxlength = this.pointBalanceNum.length;
    if (this.pointNum <= this.pointBalanceNum) {
      this.pointNumMoney = this.pointNum / this.pointRatio;
      this.noPayMoney = this.orderAmount - this.pointNumMoney;
      this.paiclUpMoney = this.orderAmount - this.pointNumMoney;
      this.paidMoney = this.orderAmount - this.pointNumMoney;
    } else {
      this.alertbox(1, '注意', '没有更多积分', '确定', '', function () { return; }, function () { });
      this.pointNum = 0;
      this.pointNumMoney = 0;
      this.paiclUpMoney = this.orderAmount;
      this.paidMoney = this.orderAmount;
    }
    if (this.pointNumMoney > this.orderAmount) {
      this.alertbox(1, '注意', '积分抵扣不能超过总价', '确定', '', function () { return; }, function () { });
      this.pointNum = 0;
      this.pointNumMoney = 0;
      this.paiclUpMoney = this.orderAmount;
      this.paidMoney = this.orderAmount;
    }
    this.discountAmount = this.pointNumMoney;

  }
  //计算未支付金额
  computedMoney() {
    let sum = 0;
    if (this.paymentRecords) {
      for (let i = 0; i < this.paymentRecords.length; i++) {
        if (this.paymentRecords[i].mcardId) {
          sum += this.paymentRecords[i].consumeAmount;
        } else {
          sum += this.paymentRecords[i].incomeAmount;
        }
      }
    }
    this.noPayMoney = this.paiclUpMoney - sum;
    this.paidMoney = this.paiclUpMoney - sum;

  }
  selectCoupon() {
    this.repertoryPopover();
  }
  repertoryPopover() {
    this.csModal.showProvince(couponPopover, {}, false, (data) => {
      if (data) {
        this.coupon = data == 1 ? "选择优惠卷" : data.name + "(" + data.describe + ")";
      }
    });
  }
  //选择支付方式
  selectPay(obj) {
    this.payments = obj;
  }
  //弹窗
  // index:1--一个按钮 2--两个按钮，fun1--第一个按钮执行函数 fun2--第二个按钮执行函数
  alertbox(index, title, msg, btn1, btn2, fun1, fun2) {
    if (index == 1) {
      let alert = this.alertCtrl.create({
        title: title,
        message: msg,
        buttons: [{
          text: btn1,
          handler: () => {
            fun1();
          }
        }]
      }).present();
    } else {
      let alert = this.alertCtrl.create({
        title: title,
        message: msg,
        buttons: [
          {
            text: btn1,
            handler: () => {
              fun1();
            }
          },
          {
            text: btn2,
            handler: () => {
              fun2();
            }
          }
        ]
      }).present();
    }
  }
  closewin() {
    this.csbzNave.closewin();
  }
}
