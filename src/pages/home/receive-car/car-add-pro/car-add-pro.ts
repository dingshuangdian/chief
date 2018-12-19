import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Alert, AlertController } from 'ionic-angular';

import { OrderEditSelectPage } from '../order-edit/order-edit-select/order-edit-select';
import { ProvincesSelectPage } from '../../../other/provinces-select/provinces-select';
import { CsModal } from '../../../../providers/cs-modal';

@Component({
  selector: 'page-car-add-pro',
  templateUrl: 'car-add-pro.html',
})
export class carAddProPage {
  public num = 1;
  public proTit;
  public userName = [];
  public userName_ = [];
  public discountAmountt = 100;
  public memo;
  public allPrice = 0;
  selectCla = { svctypeId: '', svctypeName: '' };
  flagXz: boolean = false;

  mcardId;
  flag: boolean = true;
  service;
  list;
  isCheck: boolean = false;
  staff = [];
  technicianList: any = [];
  salesmanList: any = [];
  callback;
  constructor(public navCtrl: NavController, public navParams: NavParams, public csModal: CsModal, public toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.proTit = this.navParams.get('addpro');
    this.callback = this.navParams.get('callback');

    if (this.proTit == '编辑项目') {
      this.flagXz = true;
      this.service = this.navParams.get('j');
      this.mcardId = this.service.mcardId;
    }
    if (this.proTit == '项目修改') {
      this.service = this.navParams.get('item');
      this.selectCla.svctypeId = this.service.svctypeId;
      this.mcardId = this.service.mcardId || null;
      this.num = this.service.serviceNum;
      if (this.service.staff) {
        if (this.service.staff != '' || this.service.staff != null) {
          this.service.staff.forEach((element) => {
            if (element.isSalesman == 0) {
              this.technicianList.push(element);
            } else if (element.isSalesman == 1) {
              this.salesmanList.push(element);
            }
          });
          this.userName = this.service.userName;
          this.userName_ = this.service.userName_;
        }
        this.memo = this.service.memo;
      }

    }
    if (this.proTit == '新增项目') {
      this.flagXz = false;
      this.service = { showServicePrice: 0, serviceNum: 0, goodsPrice: 0, serviceId: '', serviceName: "", servicePrice: 0, svctypeId: '', svctypePId: '', goodsNum: 0, discountAmount: 0, mcardId: '', totalAmount: 0, discountId: '', order2serviceId: '', serviceCoefficient: 100 };
    }
    if (this.service) {
      switch (this.service.svctypeId) {
        case 1:
          this.selectCla.svctypeName = '美容';
          break;
        case 2:
          this.selectCla.svctypeName = '保养';
          break;
        case 3:
          this.selectCla.svctypeName = '维修';
          break;
        case 4:
          this.selectCla.svctypeName = '改装&用品';
          break;
        case 5:
          this.selectCla.svctypeName = '轮胎';
          break;
        case 6:
          this.selectCla.svctypeName = '其他';
          break;
        case 7:
          this.selectCla.svctypeName = '钣喷';
          break;
        default: this.selectCla.svctypeName = '';

      }
    }
  }

  ionViewDidLoad() {

  }
  goOrderSelect(type) {

    let $this = this;
    let demo = function (list) {
      return new Promise((resolve) => {
        if (type == 1) {
          $this.userName = [];

          list.forEach(single => {
            single.isSalesman = 0;
            $this.userName = $this.userName.concat(single.userName);
          });
          $this.technicianList = list;
        } else if (type == 2) {
          $this.userName_ = [];

          list.forEach(single => {
            single.isSalesman = 1;
            $this.userName_ = $this.userName_.concat(single.userName);
          });
          $this.salesmanList = list;
        }
        resolve();
      })
    }
    let list = type == 1 ? $this.technicianList : $this.salesmanList;
    this.navCtrl.push(OrderEditSelectPage, {
      callback: demo,
      list: list
    });
  }
  showProvince() {
    this.csModal.showProvince(ProvincesSelectPage, {},1,(data) => {
      this.selectCla.svctypeName = data.svctypeName;
      this.selectCla.svctypeId = data.svctypeId;

    });
  }
  //增加数量
  incNum() {
    this.num += 1;
  }
  //减少数量
  decNum() {
    if (this.num > 1) {
      this.num -= 1;
    }
  }
  doSubmit() {
    this.service.serviceNum = this.num;
    this.service.discountAmount = this.service.servicePrice * (1 - this.service.serviceCoefficient / 100) * this.num;
    this.service.showServicePrice = this.service.servicePrice * this.service.serviceCoefficient / 100;
    this.service.totalAmount = this.service.showServicePrice * this.service.serviceNum;
    this.service.svctypeId = this.selectCla.svctypeId;
    this.service.memo = this.memo;
    let staffa = [];
    this.staff = staffa.concat(this.salesmanList).concat(this.technicianList);
    this.service['staff'] = this.staff;

    if (this.service.serviceName == '') {
      this.presentToast();
    } else {

      if (this.proTit == '编辑项目') {
        this.callback(this.service).then(() => {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
        })
      } else {
        this.callback(this.service).then(() => {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
        })
      }
    }
  }
  dojx() {
    this.service.serviceNum = this.num;
    this.service.discountAmount = this.service.servicePrice * (1 - this.service.serviceCoefficient / 100) * this.num;
    this.service.showServicePrice = this.service.servicePrice * this.service.serviceCoefficient / 100;
    this.service.totalAmount = this.service.showServicePrice * this.service.serviceNum;
    //this.services.svctypePId = this.selectCla.svctypeId;
    this.service.memo = this.memo;
    let staffa = [];
    this.staff = staffa.concat(this.salesmanList).concat(this.technicianList);
    this.service['staff'] = this.staff;

    if (this.service.serviceName == '') {
      this.presentToast();
    } else {
      if (this.proTit == '编辑项目') {

        this.callback(this.service).then(() => {
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
        })
      }
    }
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: '项目名称不能为空',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
  removePro() {

    this.presentAlert("确定要删除吗？")


  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '确定',
          handler: () => {
            this.service = "";
            this.callback(this.service).then(() => {
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
            })
          }
        },
      ]
    });
    alert.present();
  }
}
