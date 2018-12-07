import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsbzNave } from '../../../providers/csbz-nave';
import { orderEditPage } from '../../home/receive-car/order-edit/order-edit';
import { carConductPage } from '../../home/receive-car/car-conduct/car-conduct';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  isNave: boolean = false;

  orderId: any;//订单ID
  plateNumber: any;//车牌号码
  fillDate: any;//下单时间
  settlementTime: any;//结算时间
  orderTotalAmount: any;//总价
  orderStateName: any;//订单状态
  orderStateId: any;//订单状态Id
  memo: any;//备注
  warmTips: any;//温馨提示
  goods: any;//配件信息
  services: any;//服务信息
  editOrderFlag: boolean = true;
  settleTimeFlag: boolean = true;
  orderTypeId: any;
  overTime: any;//时间

  constructor(
    public navCtrl: NavController,
    public csbzNave: CsbzNave,
    public navParams: NavParams,
    public webSites: WebSites) {
      this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
  }

  ngOnInit() {
    this.orderId = this.navParams.get('orderId');
    this.getOrderDetail();
  }

  ionViewDidLoad() {
  }

  getOrderDetail() {
    let param = {
      orderId: this.orderId,
    }
    this.webSites.httpPost('findOrderById', param,true).subscribe((res) => {
      this.plateNumber = res.plateNumber;
      this.fillDate = res.fillDate;
      this.settlementTime = res.settlementTime;
      this.orderTotalAmount = res.orderTotalAmount;
      this.orderStateName = res.orderStateName;
      this.orderStateId = res.orderStateId;
      this.orderTypeId = res.orderTypeId;
      this.memo = res.memo;
      this.warmTips = res.warmTips;
      this.goods = res.goods;
      this.services = res.services;
      if(this.services){
      for (let i = 0; i < this.services.length; i++) {
        this.services[i]['staff_isSalesman0'] = [];
        this.services[i]['staff_isSalesman1'] = [];
        if (this.services[i].staff) {
          for (let j = 0; j < this.services[i].staff.length; j++) {
            if (this.services[i].staff[j].isSalesman == 0) {
              this.services[i]['staff_isSalesman0'].push(this.services[i].staff[j].staffUname);
            } else {
              this.services[i]['staff_isSalesman1'].push(this.services[i].staff[j].staffUname);
            }
          }
          if(this.services[i]['staff_isSalesman0'].length == 0){
            this.services[i]['staff_isSalesman0'] = null;
          }
          if(this.services[i]['staff_isSalesman1'].length == 0){
            this.services[i]['staff_isSalesman1'] = null;
          }
        }else{
          this.services[i]['staff_isSalesman0'] = null;
          this.services[i]['staff_isSalesman1'] = null;
        }
      }
    }
      this.isDisplayEditButton(this.orderStateId);
      this.isDisplaysettleTime(this.orderStateId);
    });
  }
  goOrderEdit() {
    if (this.orderTypeId == 5) {//订单编辑
      this.navCtrl.push(orderEditPage, {
        'orderId': this.orderId
      });
    } else {//维修接车
      this.navCtrl.push(carConductPage, {
        'orderId': this.orderId
      });
    }
  }
  // toggleTab(item, list) {
  //   console.log('item' + item);
  //   for (var i = 0; i < list.length; i++) {
  //     list[i].bol = false;
  //     if (item == list[i].name) {
  //       list[i].bol = true;
  //     }
  //   }
  // }

  closewin() {
    this.csbzNave.closewin();
  }

  isDisplayEditButton(index){
    switch(index){
      case 5001:
      case 6001:
      case 5002:
      case 6002:
        this.editOrderFlag = false;
        break;
      case 5003:
      case 6003:
      case 5004:
      case 6004:
      case 5005:
      case 6005:
        this.editOrderFlag = true;
        break;
    }
  }

  isDisplaysettleTime(index){
    switch(index){
      case 5003:
      case 6003:
        this.overTime = '结算';
        this.settleTimeFlag = false;
        break;
      case 5004:
      case 6004:
        this.overTime = '取消';
        this.settleTimeFlag = false;
        break;
      case 5005:
      case 6005:
        this.overTime = '挂账';
        this.settleTimeFlag = false;
        break;
      case 5001:
      case 6001:
      case 5002:
      case 6002:
        this.settleTimeFlag = true;
        break;
    }
  }

}


