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
  owners: any;//车主
  val: any;//选中的车主的value
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.plateNumber = navParams.get('plateNumber');
    this.owners = navParams.get('owners');
    for(var i=0;i<this.owners.length;i++){
      this.owners[i].flag = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarownerPopoverPage');
  }

  toggleCheckIn(obj) {
    this.val = obj;
    console.log(this.changeDetectorRef);
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  close(flag) {
    if(flag){
      var obj = {
        'flag': true,
        'val': this.val
      };
      this.viewCtrl.dismiss(obj);
    }else{
      this.viewCtrl.dismiss();
    }
  }
}
