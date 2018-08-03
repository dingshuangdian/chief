import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConsumerMsgPage } from '../../custom/consumer-msg/consumer-msg';



@Component({
  selector: 'page-member-open-success',
  templateUrl: 'member-open-success.html'
})
export class memberOpenSuccessPage {

  memberInfo: any;
  mcardNo: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.mcardNo = this.navParams.get("mcardNo");
    this.memberInfo = this.navParams.get("memberInfo");
  }

  ionViewDidLoad() {
    let allView = this.navCtrl.getViews();

    if (allView.length && allView.length == 4) {
      this.navCtrl.remove(1, 2);
    }

  }

  editMamberInfo() {
    this.navCtrl.push(ConsumerMsgPage, { consumer: this.memberInfo });
  }

  openAgain() {
    this.navCtrl.pop();
  }

}

