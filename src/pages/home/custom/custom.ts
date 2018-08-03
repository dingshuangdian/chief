
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { CsbzNave } from '../../../providers/csbz-nave';
import { newCustomPage } from './new-custom/new-custom';
import { ConsumerMsgPage } from './consumer-msg/consumer-msg';

export interface customer {
  autoId: string;
  memberId: string;
  plateNumber: string;
  memberName: string;
  mobileNumber: string;
}
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
})
export class customPage {
  isNave: boolean = false;

  flag: boolean = false;
  moreFlag: boolean = true;
  first_flag: boolean = true;

  pet: string = "common";
  seachInfo: any = { keyWords: '', pageSize: '', pageNo: '' };

  customers: customer[] = [
  ];
  showList: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, public changeDetectorRef: ChangeDetectorRef) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);


    if (this.navParams.get('keyWords')) {
      let keyWord = this.navParams.get('keyWords');
      keyWord = decodeURIComponent(keyWord);
      if (csbzNave.checkCarNo(keyWord)) {
        // this.seachInfo.keyWords = keyWord;
        this.searchCar(keyWord);
        // alert(keyWord);
      }
    }
  }
  ionViewDidLoad() {
  }
  selectItem(item) {
    if (item != 2) {
      this.navCtrl.push(ConsumerMsgPage, { consumer: item });
    } else {
      this.navCtrl.push(newCustomPage);
    }

  }
  searchCar(carNo) {
    if (carNo) {
      this.seachInfo.keyWords = carNo;
    }
    let seachInfo = {
      keyWords: this.seachInfo.keyWords,
      // pageSize: 10,
      // pageNo: this.seachInfo.pageNo
    }
    this.websites.httpPost('findMemberAuto', seachInfo, false).subscribe(res => {
      if (res != null) {
        this.customers = res;
        this.flag = true;
        this.first_flag = false;
      } else {
        this.customers = [];
        this.flag = false;
        this.first_flag = false;

      }

      this.changeDetectorRef.detectChanges();
    })

  }
  closewin() {
    this.csbzNave.closewin();
  }
  scanner() {
    this.csbzNave.carIdSacn(id => {
      this.searchCar(id);
    })
  }
  addNewCustom() {
    this.navCtrl.push(newCustomPage);
  }
}

