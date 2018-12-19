import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';
import { customPage } from '../custom';
import { newCustomPage } from '../new-custom/new-custom';
import { carEditPage } from '../../receive-car/car-edit/car-edit';
import { orderItemPage } from '../../receive-car/order-item/order-item';
import { PayRecordlPage_ } from '../../../order/pay-record_/pay-record_';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { memberOpenPage } from '../../member-mng/member-open/member-open';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the ConsumerMsgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-consumer-msg',
  templateUrl: 'consumer-msg.html',
})
export class ConsumerMsgPage {
  isNave: boolean;

  public courseTab = [
    { "name": "车辆", "bol": true, 'num': 0 },
    { "name": "会员卡", "bol": false, 'num': 0 },
    { "name": "优惠卷", "bol": false, 'num': 0 },
    { "name": "消费记录", "bol": false, 'num': 0 }
  ];
  pointBalanceNum;
  showOpenCard: boolean = false;
  consumer = { memberId: '', autoId: '' };
  bindUid;
  isRecieveCar;
  carMsg;
  permissionData;
  lastNum = '';
  hasMemberId = false;
  mcard;
  coupon = [{ name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }, { name: "洗车优惠卷", data: "2018.12.31", balance: 50, describe: '满2000减50', area: "适用于广州" }];
  page = 1;
  imgUrl;
  infiniteScroll;
  conacar = { headImg: '' };
  recordCar = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, public storage: Storage) {
    if (this.navParams.get('consumer')) {
      this.consumer = this.navParams.get('consumer');
      this.isRecieveCar = window.localStorage.getItem("showRecieveCar");
    }
    if (this.navParams.get('res')) {
      this.consumer = this.navParams.get('res');
    }
    if (this.navParams.get('memberId')) {
      this.hasMemberId = true;
      this.consumer.memberId = this.navParams.get('memberId');
    }
    if (this.navParams.get('mId')) {//从扫牌接车的最近消费的查看详情跳转过来的
      this.hasMemberId = true;
      this.consumer.memberId = this.navParams.get('mId');
      for (var i = 0; i < this.courseTab.length; i++) {
        this.courseTab[i].bol = false;
      }
      this.courseTab[this.courseTab.length - 1].bol = true;
    }
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
    this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
    this.permissionData.forEach(element => {
      if (element.menuId == "203002") {
        if (1 == (element.funcTags & 1)) {
          this.showOpenCard = true;
        } else {
          this.showOpenCard = false;
        }
      }
      if (element.menuId == "203007") {
        if (2 == (element.funcTags & 2)) {
          this.showOpenCard = true;
        } else {
          this.showOpenCard = false;
        }
      }
    })

  }
  ionViewDidLoad() {
    this.imgUrl = WebConfig.img_path;
    this.findMemberCard(this.consumer.memberId);
    this.goCarRecord(this.infiniteScroll);
    this.findCouponCard();
  }
  ionViewWillEnter() {
    this.getMember(this.consumer.memberId);

  }
  getMember(memberId) {
    let params = { memberId: memberId, auto: true }
    this.websites.httpPost('findmember', params).subscribe(res => {
      if (res.autos) {
        this.carMsg = res.autos;
        this.courseTab[0].num = this.carMsg.length;
      }
      this.pointBalanceNum = res.pointBalanceNum || 0;
      this.conacar = res;
      this.bindUid = res.bindUid;
      //var element = document.getElementById("wechat");
      // if (res.bindUid) {
      //   element.setAttribute('src', 'assets/imgs/ico-wechat1.png');
      // } else {
      //   element.setAttribute('src', 'assets/imgs/msg_06.gif');
      // }
    }, error => {
      console.error(error);
    })
  }
  toggleTab(item, list) {
    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
      if (item == list[i].name) {
        list[i].bol = true;
      }
    }
  }
  findMemberCard(memberId) {
    let params = { memberId: memberId }
    this.websites.httpPost('findmemberCard', params).subscribe(res => {
      if (res != null) {
        this.mcard = res;
        this.courseTab[1].num = this.mcard.length;
      }
    }, error => {
      console.error(error);
    })
  }
  findCouponCard() {
    this.courseTab[2].num = this.coupon.length;

  }
  goCarRecord(infiniteScroll) {
    let params1 = { memberId: this.consumer.memberId, page: 0, row: 0 };
    this.websites.httpPost('findOrderLogs', params1).subscribe(res => {
      if (res) {
        this.courseTab[3].num = res.length;
      }
    })
    let params = { memberId: this.consumer.memberId, page: this.page, row: 10 };
    this.websites.httpPost('findOrderLogs', params).subscribe(res => {
      if (res != null) {
        this.recordCar = this.recordCar.concat(res);
        if (infiniteScroll) {
          infiniteScroll.complete();
          if (res.length < 10) {
            infiniteScroll.enable(false);
          }
        };
      } else {
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(false);
        };
      }
      this.page++;
    }, error => {
      console.error(error);
    })
  }
  goEditCar(carInfo) {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.getMember($this.consumer.memberId);
        resolve();
      })
    }
    this.navCtrl.push(carEditPage, { carInfo: carInfo, memberId: this.consumer.memberId, callback: callback });
  }
  goNewCar() {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.getMember($this.consumer.memberId);
        resolve();
      })
    }
    this.navCtrl.push(carEditPage, { memberId: this.consumer.memberId, callback: callback });
  }
  goEditCustom() {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.getMember($this.consumer.memberId);
        resolve();
      })
    }
    this.navCtrl.push(newCustomPage, { consumer: this.conacar, callback: callback });
  }
  goPayRecord(msg) {
    this.navCtrl.push(PayRecordlPage_, { memberId: this.consumer.memberId, autoId: msg.autoId, plateNumber: msg.plateNumber });
  }

  doLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.goCarRecord(this.infiniteScroll);

  }
  goRecivedCar(msg) {
    msg.memberId = this.consumer.memberId;
    this.navCtrl.push(orderItemPage, { customer: msg, customerType: 3 });
  }
  closewin() {
    this.csbzNave.closewin();
  }
  openCard() {

    this.navCtrl.push(memberOpenPage, { memberInfo: this.consumer });
  }
}
