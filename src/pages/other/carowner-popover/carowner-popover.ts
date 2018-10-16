import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the CarownerPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-carowner-popover',
  templateUrl: 'carowner-popover.html',
})
export class CarownerPopoverPage {
  
  plateNumber: string;//车牌
  owners: Array<any>;//传递过来的车主
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.plateNumber = navParams.get('plateNumber');
    this.owners = navParams.get('owners');
  }

  close(obj) {
    this.viewCtrl.dismiss(obj);
  }
}
