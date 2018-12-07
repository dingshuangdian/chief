
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsbzNave } from '../../../providers/csbz-nave';
import { DatePipe } from '@angular/common';
import { orderItemPage } from '../receive-car/order-item/order-item';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-appointment-mng',
  templateUrl: 'appointment-mng.html',
})

export class appointmentMngPage {
  isNave: boolean = false;

  contentList: any;
  isRecieveCar;
  selectDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, private datePipe: DatePipe, public events: Events,public storage: Storage) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
    this.isRecieveCar= window.localStorage.getItem("showRecieveCar");
    this.events.subscribe('appointment:refresh', () => {
      this.findBookOrders();
    });
  }

  ionViewDidLoad() {
    this.selectDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.findBookOrders();
  }

  findBookOrders() {
    let parmas = { beginDate: this.selectDate, endDate: this.selectDate };
    this.websites.httpPost("findBookOrders", parmas,true).subscribe(res => {
      this.contentList = res;
    })
  }


  dateChange() {
    this.findBookOrders();
  }

  before() {
    let date = this.csbzNave.ionDateTool(new Date(this.selectDate), 1, "d", "-");
    this.selectDate = this.datePipe.transform(date, "yyyy-MM-dd");
    this.findBookOrders();
  }

  after() {
    let date = this.csbzNave.ionDateTool(new Date(this.selectDate), 1, "d", "+");
    this.selectDate = this.datePipe.transform(date, "yyyy-MM-dd");
    this.findBookOrders();
  }

  onConfirm(appointmentInfo) {
    this.navCtrl.push(orderItemPage, { memberId: appointmentInfo.memberId, orderId: appointmentInfo.orderId });
  }

  closewin() {
    this.csbzNave.closewin();
  }
}

