import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { DomSanitizer } from '@angular/platform-browser';


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
  msgList;

  constructor(public navCtrl: NavController, public navParams: NavParams, private websize: WebSites, public sanitizer: DomSanitizer) {
  }
  assembleHTML(strHTML: any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
  }
  ionViewDidLoad() {
    this.getMsglist();
  }

  ionViewDidEnter() {

  }
  getMsglist() {
    this.websize.httpGet("getMsgList", {}).subscribe(res => {
      if (res) {
        this.msgList = res;
      }
    })

  }
  goInsureProgress(news) {
    this.websize.httpPost("updateMsgStatus", { messageId: news.messageId }).subscribe(res => {
      if (res) {
        

      }

    })

  }

}
