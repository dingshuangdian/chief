import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RecordPageEdit } from './record-edit/record-edit';
import { WebSites } from '../../../providers/web-sites';

/**
 * Generated class for the RecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-record',
  templateUrl: 'record.html',
})
export class RecordPage {
  //record = [{ createTime: '', paymentName: '', isIncome: '', journalAmount: '', memo: '', journalTypeName: '' }];
  record = [];
  infiniteScroll;
  page = 1;
  callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, public websize: WebSites) {
  }

  ionViewDidLoad() {
    this.RecordCheck('');
  }
  RecordCheck(infiniteScroll) {
    let params = { page: this.page, row: 10 };
    this.websize.httpPost('findJournals', params).subscribe(res => {
      if (res != null) {
        this.record = this.record.concat(res);
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
    })
  }

  toRecordEdit() {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.page = 1;
        $this.record = [];
        if ($this.infiniteScroll) {
          $this.infiniteScroll.enable(true);
        }
        $this.RecordCheck($this.infiniteScroll);
        resolve();
      })
    }
    this.navCtrl.push(RecordPageEdit, { callback: callback });
  }
  doLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.RecordCheck(this.infiniteScroll);

  }

}
