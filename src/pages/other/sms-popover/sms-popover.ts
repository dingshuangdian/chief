import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CsModal } from '../../../providers/cs-modal';
import { CsbzNave } from '../../../providers/csbz-nave';
import { WebSites } from '../../../providers/web-sites';
/**
 * Generated class for the SmsPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sms-popover',
  templateUrl: 'sms-popover.html',
})
export class SmsPopoverPage {

  postMsg: any;
  phoneNum: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public csModal: CsModal,
    public csbzNave: CsbzNave,
    public webSites: WebSites,
  ) {
    this.postMsg = this.navParams.get('postMsg');
  }
  //取消发送
  cancelBtn() {
    this.viewCtrl.dismiss();
  }
  //确定发送
  sendBtn() {
    if (!this.postMsg) {
      this.csModal.showAlert('请输入短信内容！', '', '', '确定', '', '');
      return false;
    } else {
      if (!this.phoneNum) {
        this.csModal.showAlert('请输入手机号码！', '', '', '确定', '', '');
        return false;
      } else if (!this.csbzNave.checkTelephone(this.phoneNum)) {
        this.csModal.showAlert('手机号码格式不正确！', '', '', '确定', '', '');
        return false;
      } else {
        this.webSites.httpPost('postMessage', {
          postMsg: this.postMsg,
          phoneNum: this.phoneNum
        }).subscribe(
          res => {
            this.viewCtrl.dismiss();
            this.csModal.showAlert('发送成功', '', '', '确定', '', '');
          },
          err => {
            this.csModal.showAlert(err, '', '', '确定', '', '');
          },
        )
      }
    }
  }
}
