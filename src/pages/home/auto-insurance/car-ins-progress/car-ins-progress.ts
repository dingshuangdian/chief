import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';

import { DetailPolicyPage } from '../detail-policy/detail-policy';
import { SupplementaryInfoPage } from '../supplementary-info/supplementary-info';
import { ReservationListPage } from '../reservation-list/reservation-list';
import { RequotationPage } from '../requotation/requotation';
import { WebSites } from '../../../../providers/web-sites';
import { CsModal } from '../../../../providers/cs-modal';
import { PaymentPolicyPage } from '../payment-policy/payment-policy';

/**
 * Generated class for the CarInsProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-car-ins-progress',
  templateUrl: 'car-ins-progress.html',
})
export class CarInsProgressPage {

  public courseTab = [
    {'name': '已退回','bol': false},
    {'name': '待核保','bol': false},
    {'name': '待支付','bol': false},
    {'name': '待收单','bol': false},
    {'name': '已完成','bol': false},
  ];
  public licenseNo = '';//搜索的关键字
  public tab = 0;//tab下标
  private cUrl_: string;//请求的接口
  public orderResult: Array<any>;//订单数组
  public isShow: boolean = false;//true--有数据 false--无数据

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public websites: WebSites,
    public csModal: CsModal,
  ) {
  }

  ionViewDidEnter() {
    let num = this.navParams.get('num');
    if(num){
      this.courseTab[num].bol = true;
      switch(num){
        case 0:
          this.cUrl_ = 'qryBackOrder';//已退回数据
          break;
        case 1:
          this.cUrl_ = 'qryUnderwritingOrder';//待核保数据
          break;
        case 2:
          this.cUrl_ = 'qryPayOrder';//待支付数据
          break;
        case 3:
          this.cUrl_ = 'qryIssuingOrder';//待收单数据
          break;
        case 4:
          this.cUrl_ = 'qryFinishOrder';//已完成数据
          break;
      }
    }else{
      this.courseTab[1].bol = true;
      this.cUrl_ = 'qryUnderwritingOrder';//待核保数据
    }
    this.reqResult(this.cUrl_,{});
  }

  //切换 已退回/待核保/待支付/待收单/已完成
  toggleTab(list, index) {
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
    }
    list[index].bol = true;
    this.tab = index;
    switch(this.tab){
      case 0:
        this.cUrl_ = 'qryBackOrder';
        break;
      case 1:
        this.cUrl_ = 'qryUnderwritingOrder';
        break;
      case 2:
        this.cUrl_ = 'qryPayOrder';
        break;
      case 3:
        this.cUrl_ = 'qryIssuingOrder';
        break;
      case 4:
        this.cUrl_ = 'qryFinishOrder';
        break;
    }
    this.reqResult(this.cUrl_,{});
  }

  //保单详情
  toDetails = function(orderTags, orderId) {
    let titleName = orderTags==4?'报价详情':'保单详情';
    let isShowOrHide;
    let gUrl = DetailPolicyPage;
    if(orderTags == 0){//stateFlag = ''
      isShowOrHide = 1;
    }else if (orderTags == 1){//stateFlag = 资料不齐
      isShowOrHide = 1;
    }else if (orderTags == 2) {//stateFlag = 无法核价(订单作废)
      isShowOrHide = 2;
    } else if (orderTags == 4) {//stateFlag = 已报价未核保
      isShowOrHide = 5;
    } else if (orderTags == 8) {//stateFlag = 核保中
      isShowOrHide = 6;
    } else if (orderTags == 16) {//stateFlag = 已报价
      isShowOrHide = 7;
    } else if (orderTags == 32) {//stateFlag = 待支付
      isShowOrHide = 3;
    } else if (orderTags == 64) {//stateFlag = 未支付(已失效)
      isShowOrHide = 7;
    } else if (orderTags == 128) {//stateFlag = 已支付
      isShowOrHide = 8;
    } else if (orderTags == 256) {//stateFlag = 确定收单
      isShowOrHide = 9;
    }else if (orderTags == 512) {//stateFlag = 15天无反馈
      isShowOrHide = 1;
    } else if (orderTags == 2048) {//stateFlag = 待支付
      isShowOrHide = 4;
    };
    this.navCtrl.push(gUrl, {
        title: titleName,
        btnFlag: isShowOrHide,
        orderId: orderId
    });
  };

  //修改保单
  goModifyPolicy(orderId){
    if (orderId != null) {
      this.navCtrl.push(RequotationPage,{
        'orderId': orderId, 
        'requotationType': 6,
      });
    } else {
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //补充资料
  goSupplementaryInfo(orderId){
    this.navCtrl.push(SupplementaryInfoPage,{'orderId':orderId});
  }

  //重新报价
  goRequotation(orderId){
    if(orderId != null){
      this.navCtrl.push(RequotationPage,{
        'orderId': orderId,
        'requotationType': 3,
      });
    }else{
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //申请核保
  toUnderwriting(orderId){
    if(orderId != null){
      this.navCtrl.push(SupplementaryInfoPage,{
        'orderId': orderId
      });
    }
  }
  
  //预约出单
  goReservationList(orderId){
    if(orderId != null){
      this.navCtrl.push(ReservationListPage,{'orderId':orderId});
    }else{
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //确定收单
  confirReceipt(orderId){
    let alert = this.alertCtrl.create({
      title: '收单提示',
      subTitle: '您确定已收到保单快递？',
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: () => {
            this.websites.httpPost('issuingOrder',{
              'orderId': orderId
            })
            .subscribe(res => {
              this.csModal.showAlert('收单成功', this.reqResult(this.cUrl_,{}), '', '确定', '', '');
            },err => {
              this.csModal.showAlert('收单失败','', '', '确定', '', '');
            });
          }
        }
      ]
    });
    alert.present();
  }

  //删除订单
  deleteOrder(orderId){
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '您确定要删除订单吗？',
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: () => {
            this.websites.httpPost('removeOrder',{
              'orderId': orderId
            })
            .subscribe(res => {
              this.csModal.showAlert(res, this.reqResult(this.cUrl_,{}), '', '确定', '', '');
            },err => {
              this.csModal.showAlert('删除失败','', '', '确定', '', '');
            });
          }
        }
      ]
    });
    alert.present();
  }

  //立即支付
  toPayOrder = function(orderId) {
    if (orderId != null) {
      this.navCtrl.push(PaymentPolicyPage, { 'orderId': orderId });
    } else {
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //下拉刷新
  doRefresh(refresher) {
    
  }
  //上拉刷新
  doInfinite(infiniteScroll) {
    
  }

  //查询
  searchOrder(){
    if(!this.licenseNo) return ;
    var param = {'licenseNo': this.licenseNo};
    this.reqResult(this.cUrl_,param);
  }

  //显示的操作按钮
  showBtnType = function(opFlag) {
    this.isOneOrTwo = true;
    this.orderMes = false;//控制 保单详情 操作按钮
    this.addMes = false;//控制 补充资料 操作按钮
    this.delOrder = false;//控制 删除订单 操作按钮
    this.applyUnderwriting = false;//控制 申请核保 操作按钮
    this.makeAppointment = false;//控制 预约出单 操作按钮
    this.reBid = false;//控制 重新报价 操作按钮
    this.sureOrder = false;//控制 确定收单 操作按钮
    this.changePolicy = false;//控制 修改保单 操作按钮

    if ((opFlag & 1) > 0) {
      this.orderMes = true;
      this.isOneOrTwo = false;
    }
    if ((opFlag & 2) > 0) {
      this.addMes = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 4) > 0) {
      this.delOrder = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 8) > 0) {
      this.applyUnderwriting = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 16) > 0) {
      this.reBid = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 32) > 0) {
      this.makeAppointment = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 64) > 0) {
      this.sureOrder = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 128) > 0) {
      this.changePolicy = true;
      this.isOneOrTwo = true;
    }
    if ((opFlag & 256) > 0) {
      this.orderPay = true;
      this.isOneOrTwo = true;
    }
  }

  //请求接口
  reqResult(url,param){
    return new Promise((resolve,reject) => {
      this.websites.httpPost(this.cUrl_, param)
      .subscribe(res => {
        if(res){
          this.isShow = true;
          this.orderResult = res;
          for(let i in this.orderResult){
            this.showBtnType(this.orderResult[i].opFlag);
          }
        }else{
          this.isShow = false;
        }
        resolve();
      });
    })
  }
}
