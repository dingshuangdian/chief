import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar, ModalController } from 'ionic-angular';
import { orderEditPage } from '../home/receive-car/order-edit/order-edit';
import { OrderDetailPage } from './order-detail/order-detail';
import { ConsumerMsgPage } from '../home/custom/consumer-msg/consumer-msg';
import { carConductPage } from '../home/receive-car/car-conduct/car-conduct';
import { AccountOrderPage } from './account-order/account-order';
import { WebSites } from '../../providers/web-sites';
import { CsModal } from '../../providers/cs-modal';
import { CsbzNave } from '../../providers/csbz-nave';
import { Subject } from 'rxjs/Subject';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  @ViewChild(Navbar) navBar: Navbar;

  testRadioOpen: boolean;
  testRadioResult;
  permissionData;
  showOrder: boolean = false;
  showPay: boolean = false;
  showUpdata: boolean = false;
  showCancel: boolean = false;
  public items = [];
  public flag_sord = true;//订单时间  true--升序 false--降序
  public moreData = true;
  private searchTerms = new Subject<object>();
  public courseTab = [
    { "name": "进行中", "bol": true },
    { "name": "已挂起", "bol": false },
    { "name": "已挂账", "bol": false },
    { "name": "已完成", "bol": false },
    { "name": "已取消", "bol": false }
  ];
  public orderType = ['5001,6001', '5002,6002', '5005,6005', '5003,6003', '5004,6004'];
  public selType = ['fillDate', 'settlementTime'];
  public timeType = ['asc', 'desc'];
  public orderListParam = {
    orderTypeId: this.orderType[0],
    page: 1,
    row: 10,
    sidx: this.selType[0],
    sord: this.timeType[0],
    keyWords: ''
  }
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public Websites: WebSites,
    public modalCtrl: ModalController,
    public csModal: CsModal,
    private csbzNave: CsbzNave) {
  }
  ionViewWillEnter() {
    this.showOrder = false;
    this.showPay = false;
    this.showUpdata = false;
    this.showCancel = false;
    this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
    this.permissionData.forEach(element => {
      if (element.menuId == "202005") {
        this.showOrder = (8 == (element.funcTags & 8)) ? true : false;
        this.showPay = (1 == (element.funcTags & 1)) ? true : false;
        this.showUpdata = (32 == (element.funcTags & 32)) ? true : false;
        this.showCancel = (64 == (element.funcTags & 64)) ? true : false;
      }
    })
    this.items = [];
    this.getOrderList(this.orderListParam);
  }
  ngOnInit() {

  }
  //获取订单
  getOrderList(param) {
    let self = this;
    return new Promise(function (resolve, reject) {
      if (!param.keyWords) {
        self.Websites.httpPost('orderList', param).subscribe(res => {
          if (!res) {
            self.moreData = false;
            resolve();
            return
          }
          for (let i = 0; i < res.length; i++) {
            self.items.push(res[i]);
          }
          if (res.length < self.orderListParam.row) {
            self.moreData = false;
          } else {
            self.moreData = true;

          }
          resolve();
        });
      } else {
        self.searchCar(param);
      }

    })
  }
  //下单/结算时间排序
  sordTime() {
    this.items = [];
    this.flag_sord = !this.flag_sord;
    if (this.flag_sord) {
      this.orderListParam.sord = this.timeType[0];
    } else {
      this.orderListParam.sord = this.timeType[1];
    }
    this.getOrderList(this.orderListParam);
  }
  //下拉刷新
  doRefresh(refresher) {
    this.orderListParam.page = 1;
    this.orderListParam.row = 10;
    this.items = [];
    if (!this.orderListParam.keyWords) {
      this.getOrderList(this.orderListParam)
        .then(() => {
          refresher.complete();
        });
    } else {
      this.searchCar(this.orderListParam)
        .then(() => {
          refresher.complete();
        });
    }
  }
  //上拉刷新
  doInfinite(infiniteScroll) {
    this.orderListParam.page++;
    if (!this.orderListParam.keyWords) {
      this.getOrderList(this.orderListParam)
        .then(() => {
          infiniteScroll.complete();
          if (!this.moreData) {
            infiniteScroll.enable(false);
          }
        });
    } else {
      this.searchCar(this.orderListParam)
        .then(() => {
          infiniteScroll.complete();
          if (!this.moreData) {
            infiniteScroll.enable(false);
          }
        });
    }

  }
  ionViewDidLoad() {

    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    this.csbzNave.closewin();
  }
  toggleTab(list, index) {
    this.items = [];
    this.flag_sord = true;
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
    }
    list[index].bol = true;
    switch (index) {
      case 0:
        this.orderListParam.orderTypeId = this.orderType[0];
        this.orderListParam.sidx = this.selType[0];
        break;
      case 1:
        this.orderListParam.orderTypeId = this.orderType[1];
        this.orderListParam.sidx = this.selType[0];
        break;
      case 2:
        this.orderListParam.orderTypeId = this.orderType[2];
        this.orderListParam.sidx = this.selType[0];
        break;
      case 3:
        this.orderListParam.orderTypeId = this.orderType[3];
        this.orderListParam.sidx = this.selType[1];
        break;
      case 4:
        this.orderListParam.orderTypeId = this.orderType[4];
        this.orderListParam.sidx = this.selType[0];
        break;
    }
    this.orderListParam.page = 1;
    this.orderListParam.row = 10;
    this.orderListParam.sord = this.timeType[0];
    this.getOrderList(this.orderListParam);
  }
  //取消订单
  cansolOrderConfirm(number, orderTime, orderId) {
    let confirm = this.alerCtrl.create({
      title: '消息',
      message: '确认取消订单吗？车牌号' + number + ',下单时间' + orderTime,
      buttons: [
        {
          text: '取消',
          handler: () => {
            return;
          }
        },
        {
          text: '确定',
          handler: () => {
            this.Websites.httpPost('cansolOrder', { 'orderId': orderId }).subscribe(res => {
              let data = res;//{orderTypeId:***}
              this.orderListParam.page = 1;
              this.orderListParam.row = 10;
              this.items = [];
              this.getOrderList(this.orderListParam);
            })
          }
        }
      ]
    });
    confirm.present();
  }
  //挂起
  susupendOrderConfirm(orderId) {
    let confirm = this.alerCtrl.create({
      title: '消息',
      message: '温馨提示:在实际操作过程中如需延迟完工或者延迟结算时，可先将订单“挂起”。同时挂起订单允许修改、取消等操作！请确认是否要将订单进行挂起？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            return;
          }
        },
        {
          text: '确定',
          handler: () => {
            this.Websites.httpPost('susupendOrder', { 'orderId': orderId }).subscribe(res => {
              let data = res;
              this.orderListParam.page = 1;
              this.orderListParam.row = 10;
              this.items = [];
              this.getOrderList(this.orderListParam);
            })
          }
        }
      ]
    });
    confirm.present();
  }
  goOrderEdit(orderId, type) {
    if (type == 5) {//订单编辑
      this.navCtrl.push(orderEditPage, {
        'orderId': orderId
      });
    } else {//维修接车
      this.navCtrl.push(carConductPage, {
        'orderId': orderId
      });
    }
  }
  goOrderDetail(orderId) {
    this.navCtrl.push(OrderDetailPage, {
      'orderId': orderId
    });
  }
  itemSelected(item) {
    this.navCtrl.push(ConsumerMsgPage, {
      consumer: item
    });
  }
  //结算
  goAccountOrder(orderId) {
    this.navCtrl.push(AccountOrderPage, {
      'orderId': orderId
    });
  }
  //搜索
  moduleShow(text) {
    this.items = [];
    this.orderListParam.keyWords = text;
    //   this.searchTerms.next(this.orderListParam);
    //   this.searchTerms.pipe( debounceTime(300),
    //   // ignore new term if same as previous term
    //   distinctUntilChanged(),
    //   // switch to new search observable each time the term changes
    //   switchMap((term: object) => this.Websites.httpPost('orderList', term, false))
    // ).subscribe(res => {
    //   if (!res) {
    //     this.moreData = false;
    //     return;
    //   }
    //   for (let i = 0; i < res.length; i++) {
    //     this.items.push(res[i]);
    //   }
    //   if (res.length < this.orderListParam.row) {
    //     this.moreData = false;
    //   } else {
    //     this.moreData = true;
    //   }
    // })

    this.searchCar(this.orderListParam)

  }
  searchCar(params) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.Websites.httpPost('orderList', params).subscribe(res => {
        if (!res) {
          self.moreData = false;
          resolve();
          return
        }
        for (let i = 0; i < res.length; i++) {
          self.items.push(res[i]);
        }
        if (res.length < params.row) {
          self.moreData = false;
        } else {
          self.moreData = true;
        }
        resolve();
      });
    })
  }
}




