
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsbzNave } from '../../../providers/csbz-nave';
import { memberOpenPage } from './member-open/member-open';
import { memberRechargePage } from './member-recharge/member-recharge';
import { Storage } from '@ionic/storage';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-member-mng',
  templateUrl: 'member-mng.html',
})
export class memberMngPage {
  isNave: boolean = false;
  openCard: boolean = false;
  openChard: boolean = false;
  permissionData;
  searchPlaceholder: string = "请输入手机、车牌号或卡号进行模糊搜索";
  url: string = "findMcard4keywords";
  segmentType: string;
  keyWords: string = "";
  memberList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, public storage: Storage) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
    this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
    this.permissionData.forEach(element => {
      if (element.menuId == "203002") {
        if (1 == (element.funcTags & 1)) {
          this.openCard = true;
          this.openChard = true;
          this.segmentType = "topUp";
        } else {
          this.openCard = false;
          this.openChard = false;
        }
      }

      if (element.menuId == "203007") {
        if (4 == (element.funcTags & 4)) {
          this.openChard = true;
          this.segmentType = "topUp";
        } else {
          this.openChard = false;
        }
      }
      if (element.menuId == "203007") {
        if (2 == (element.funcTags & 2)) {
          this.openCard = true;
          if (!this.openChard) {
            this.segmentType = "open";
          }
        } else {
          this.openCard = false;
        }
      }
    })


    if (this.navParams.get('keyWords')) {
      let keyWord = this.navParams.get('keyWords');
      keyWord = decodeURIComponent(keyWord);
      if (csbzNave.checkCarNo(keyWord)) {
        this.keyWords = keyWord;
        this.searchAction();
      }
    }
  }

  ionViewDidLoad() {

  }

  selectItem(member) {
    if (this.segmentType == 'topUp') {
      this.navCtrl.push(memberRechargePage, { memberInfo: member });
    } else if (this.segmentType == 'open') {
      this.navCtrl.push(memberOpenPage, { memberInfo: member });
    }
  }

  openMemberCard(member) {
    this.navCtrl.push(memberOpenPage, { memberInfo: member });
  }

  searchAction() {
    this.websites.httpPost(this.url, { keywords: this.keyWords }, false).pipe(debounceTime(500), distinctUntilChanged()).subscribe(res => {
      this.memberList = res || [];
    })
  }

  segmentChange() {
    if (this.segmentType == "topUp") {
      this.searchPlaceholder = "请输入手机、车牌号或卡号进行模糊搜索";
      this.url = "findMcard4keywords";
    } else if (this.segmentType == "open") {
      this.searchPlaceholder = "请输入手机或车牌号进行模糊搜索";
      this.url = "findMemberAuto";
    }
    this.memberList && this.searchAction();
  }


  closewin() {
    this.csbzNave.closewin();
  }
}

