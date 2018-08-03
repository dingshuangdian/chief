import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { DatePipe } from '@angular/common';
import { PsnCommissionCountPage } from './psn-commission-count/psn-commission-count';

/**
 * Generated class for the CommissionCountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-commission-count',
  templateUrl: 'commission-count.html',
})
export class CommissionCountPage {
  beginDate = ''
  recordTC = [];
  endDate = '';
  page = 1;
  infiniteScroll;
  constructor(public navCtrl: NavController, public navParams: NavParams, public websize: WebSites, private datePipe: DatePipe, public events: Events) {
    this.endDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let a = this.endDate.substr(0, 8);
    let b = parseInt(this.endDate.substr(8, 2));
    let c = b - b + 1;
    let d;
    if (c < 10) {
      d = '0' + c + '';
    } else {
      d = c + '';
    }
    this.beginDate = a + d;

    this.events.subscribe('stateTabs:CommissionCountPage', () => {
      this.checkTC('');
    })

  }


  changeCheckTC() {
    this.recordTC = [];
    this.page = 1;
    this.checkTC('');
  }
  checkTC(infiniteScroll) {
    let params = { beginDate: this.beginDate, endDate: this.endDate, page: this.page, row: 10 };
    this.websize.httpPost('findPmbdReport', params).subscribe(res => {
      if (res != null) {
        this.recordTC = this.recordTC.concat(res);
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
      if (infiniteScroll) {
        this.page++;
      }
    }, error => {
    })
  }
  doLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    if (this.recordTC.length && this.recordTC.length <= 10) {
      this.page++;
    }
    this.checkTC(this.infiniteScroll);
  }
  goToCommission() {
    this.navCtrl.push(PsnCommissionCountPage);
  }

}
