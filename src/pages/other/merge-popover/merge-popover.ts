import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';


@Component({
  selector: 'merge-popover',
  templateUrl: 'merge-popover.html'
})
export class MergePopoverComponent {

  // selectMember: any = { memberName: "", mobileNumber: "" };
  selectNumber: any;
  selectName: any;

  autoList: any = [];
  memberList: any = [];
  asorder: any = { count: 0 };

  memberInfo: any = {};


  constructor(public viewCtrl: ViewController, public navParams: NavParams, public websites: WebSites, private alertCtrl: AlertController) {
    this.memberInfo = this.navParams.get("memberInfo");
    this.autoList = this.memberInfo.auto;
    this.memberList = this.memberInfo.member;

    if (this.memberInfo.hasOwnProperty('asorder')) {
      if (this.memberInfo.asorder.hasOwnProperty('count')) {
        this.asorder = this.memberInfo.asorder.count;
      }
    }


    this.memberList.forEach(member => {
      if (member.memberId == this.memberInfo.mergeMemberId) {
        this.selectNumber = member;
        this.selectName = member;
      }
    });
  }

  close(type) {
    if (type)
      this.presentConfirmAlert()
    else
      this.viewCtrl.dismiss();
  }

  updateMemberMerge() {
    let params = {
      memberId1: this.memberInfo.currenMemberId,
      memberId2: this.memberInfo.mergeMemberId,
      checkedId: this.selectNumber.memberId,
      memberName: this.selectName.memberName
    }
    this.websites.httpPost("updateMemberMerge", params).subscribe(res => {
      console.log(res);
      this.viewCtrl.dismiss();
    })
  }

  presentConfirmAlert() {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '请确认合并已经选择的客户信息？请谨慎处理！',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.updateMemberMerge();
          }
        }
      ]
    });
    alert.present();
  }




}
