
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
  public moreData = true;
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
//   getCarInfo(params) {
//     let self = this;
//     return new Promise(function (resolve, reject) {
//         if (!params.keyWords) {
//             self.websites.httpPost('findMemberAuto', params, false).subscribe(res => {
//                 if (!res) {
//                     self.moreData = false;
//                     self.customers = [];
//                     self.flag = false;
//                     self.first_flag = false;
//                     resolve();
//                     return
//                 }
//                 for (let i = 0; i < res.length; i++) {
//                     self.customers.push(res[i]);
//                 }
//                 if (res.length < self.seachInfo.pageSize) {
//                     self.moreData = false;
//                 } else {
//                     self.moreData = true;

//                 }
//                 self.flag = true;
//                 self.first_flag = false;
//                 resolve();
//                 // self.changeDetectorRef.detectChanges();
//             })
//         } else {
//             self.searchCar(params.keyWords);
//         }
//     })
// }
// addInput(carNo) {
//   this.seachInfo.pageNo = 1;
//   this.customers = [];
//   this.searchCar(carNo.value);
// }
// searchCar(carNo) {
//   if (carNo) {
//       this.seachInfo.keyWords = carNo;
//   }
//   let self = this;
//   return new Promise(function (resolve, reject) {
//       self.websites.httpPost('findMemberAuto', self.seachInfo, false).subscribe(res => {
//           if (!res) {
//               self.moreData = false;
//               self.customers = [];
//               self.flag = false;
//               self.first_flag = false;
//               resolve();
//               return
//           }
//           for (let i = 0; i < res.length; i++) {
//               self.customers.push(res[i]);
//           }
//           if (res.length < self.seachInfo.pageSize) {
//               self.moreData = false;
//           } else {
//               self.moreData = true;

//           }
//           self.flag = true;
//           self.first_flag = false;
//           resolve();

//           //self.changeDetectorRef.detectChanges();
//       })
//   })
// }
searchCar(carNo) {
    if (carNo) {
        this.seachInfo.keyWords = carNo;
    }
    let seachInfo = {
        keyWords: this.seachInfo.keyWords,
        pageSize: 20,
        pageNo: this.seachInfo.pageNo
    }
    this.websites.httpPost('findMemberAuto', seachInfo).subscribe(res => {
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
//    //上拉刷新
//    doInfinite(infiniteScroll) {
//     this.seachInfo.pageNo++;
//     if (!this.seachInfo.keyWords) {
//         this.getCarInfo(this.seachInfo)
//             .then(() => {
//                 infiniteScroll.complete();
//                 if (!this.moreData) {
//                     infiniteScroll.enable(false);
//                 }
//             });
//     } else {
//         this.searchCar(this.seachInfo.keyWords)
//             .then(() => {
//                 infiniteScroll.complete();
//                 if (!this.moreData) {
//                     infiniteScroll.enable(false);
//                 }
//             });
//     }
// }
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

