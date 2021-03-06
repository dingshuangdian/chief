import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebConfig } from '../../../providers/web-config';

/**
 * Generated class for the WxPayPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wx-pay-popover',
  templateUrl: 'wx-pay-popover.html',
})
export class WxPayPopoverPage {
  imgUrl=WebConfig.img_path1;
  codeUrl: '';//codeURL
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
  ) {
    this.codeUrl = this.navParams.get('codeUrl');
  } 
}
