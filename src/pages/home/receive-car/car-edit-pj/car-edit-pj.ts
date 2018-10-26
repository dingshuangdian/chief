import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { ProvincesPage } from '../../../other/provinces/provinces';
import { OrderEditSelectPage } from '../order-edit/order-edit-select/order-edit-select';

@Component({
  selector: 'page-car-edit-pj',
  templateUrl: 'car-edit-pj.html',
})
export class carEditPjPage {

  flagXz: boolean = false;
  public discountAmountt = 100;
  public allPrice = 0;
  addpro;
  flag;

  callback;
  editPro;
  goods =
    {
      order2goodsId: '',
      goodsId: '',
      specId: '',
      goodsName: '',
      goodsPrice: 0,
      goodsNum: 1,
      discountAmount: 0,//优惠多少价格
      totalAmount: 0,
      mcardId: '',
      sellUid: '',
      memo: '',
      showGoodsPrice: 0,
      sellUname: '选择销售',
      discountCoefficient: 100,//优惠后的折扣
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.callback = this.navParams.get('callback');
    this.addpro = this.navParams.get('addpro');
    this.flag = this.navParams.get('flag') ? this.navParams.get('flag') : ''
    if (this.addpro == '编辑配件') {
      this.flagXz = true;
      this.editPro = this.navParams.get('j');
      this.goods.goodsId = this.editPro.goodsId;
      this.goods.specId = this.editPro.specId;
      this.goods.goodsName = this.editPro.goodsName;
      this.goods.goodsPrice = this.editPro.salePrice;
    } else if (this.addpro == '配件修改') {
      this.goods = this.navParams.get('item');
      if (this.goods.sellUname == '') {
        this.goods.sellUname = '选择销售';
      }
    }
  }
  ionViewDidLoad() {
  }
  showSelect_(flagType) {
    let $this = this;
    let d = function (data) {
      return new Promise((resolve, reject) => {
        $this.goods.sellUname = data.userName;
        $this.goods.sellUid = data.userId;
        resolve();
      })
    }
    this.navCtrl.push(OrderEditSelectPage, { callback: d, flagType: flagType });
  }
  showProvince() {
    let profileModal = this.modalCtrl.create(ProvincesPage, {}, { cssClass: 'provincesModal' });
    profileModal.present();
  }
  //增加数量
  incNum() {
    this.goods.goodsNum += 1;
  }
  //减少数量
  decNum() {
    if (this.goods.goodsNum > 1) {
      this.goods.goodsNum -= 1;
    }
  }
  doSubmit() {
    this.goods.discountAmount = this.goods.goodsPrice * (1 - this.goods.discountCoefficient / 100) * this.goods.goodsNum;
    this.goods.showGoodsPrice = this.goods.goodsPrice * this.goods.discountCoefficient / 100;
    this.goods.totalAmount = this.goods.showGoodsPrice * this.goods.goodsNum;
    if (this.goods.sellUname == '选择销售') {
      this.goods.sellUname = '';
    }
    if (this.addpro == '配件修改') {
      this.callback(this.goods).then(() => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
      })
    } else if (this.addpro == '编辑配件' && !this.flag) {
      this.callback(this.goods).then(() => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
      })
    } else {
      this.callback(this.goods).then(() => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 4));
      })
    }
  }
  dojx() {
    this.goods.discountAmount = this.goods.goodsPrice * (1 - this.goods.discountCoefficient / 100) * this.goods.goodsNum;
    this.goods.showGoodsPrice = this.goods.goodsPrice * this.goods.discountCoefficient / 100;
    this.goods.totalAmount = this.goods.showGoodsPrice * this.goods.goodsNum;
    if (this.goods.sellUname == '选择销售') {
      this.goods.sellUname = '';
    }
    this.callback(this.goods).then(() => {
      this.navCtrl.pop();
    })
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
            this.callback("").then(() => {
              this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 2));
            })
          }
        },
      ]
    });
    alert.present();
  }
}