import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { DomSanitizer } from '@angular/platform-browser';
import { CarInsProgressPage } from '../car-ins-progress/car-ins-progress';


/**
 * Generated class for the MsgInsurancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-msg-insurance',
  templateUrl: 'msg-insurance.html',
})
export class MsgInsurancePage {
  msgList;//消息列表

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private websize: WebSites, 
    public sanitizer: DomSanitizer,
  ) {
  }
  assembleHTML(strHTML: any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }
  ionViewDidLoad() {
    this.getMsglist();
  }

  ionViewDidEnter() {

  }

  //获取消息列表
  getMsglist() {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.websize.httpGet("getMsgList", {}).subscribe(res => {
        if (res) {
          self.msgList = res;
          resolve();
        }
      })
    })
  }

  //查看详情
  goInsureProgress(news) {
    this.websize.httpPost("updateMsgStatus", { messageId: news.messageId }).subscribe(res => {
      if (res) {
        this.navCtrl.push(CarInsProgressPage,{
          'num': news.urlParams
        });
      }
    })
  }

  //下拉加载更多
  doRefresh(event){
    this.getMsglist()
    .then(res => {
      event.complete();
    });
  }

}
