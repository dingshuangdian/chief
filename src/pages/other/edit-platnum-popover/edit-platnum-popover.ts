import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController  } from 'ionic-angular';
import { CsbzNave } from '../../../providers/csbz-nave';

/**
 * Generated class for the EditPlatnumPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-platnum-popover',
  templateUrl: 'edit-platnum-popover.html',
})
export class EditPlatnumPopoverPage {

  plateNumber: string='';//车牌

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public csbzNave: CsbzNave,
  ) {
    this.plateNumber = navParams.get('plateNumber');
  }

  close(flag) {
    if(flag){
      let CarNo = this.csbzNave.checkCarNo(this.plateNumber);
      if (!CarNo) {
        const alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '请输入正确的车牌号，如粤A88888',
          buttons: ['确定']
        });
        alert.present();
        return ;
      }else{
        this.viewCtrl.dismiss(this.plateNumber);
      }
    }else{
      this.viewCtrl.dismiss();
    } 
  }
}
