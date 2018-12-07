
import { Component, ChangeDetectorRef, OnInit, DoCheck } from '@angular/core';
import { NavController, NavParams, Searchbar, Events } from 'ionic-angular';
import { orderItemPage } from './order-item/order-item'
import { WebSites } from '../../../providers/web-sites'
import { carConductPage } from './car-conduct/car-conduct';
import { CsbzNave } from '../../../providers/csbz-nave';
import { newCarEditPage } from './new-car-edit/new-car-edit';
import { washCarPage } from './wash-car/wash-car';
import { Storage } from '@ionic/storage';
export interface customer {
    autoId: string;
    memberId: string;
    plateNumber: string;
    memberName: string;
    mobileNumber: string;

}
@Component({
    selector: 'page-receive-car',
    templateUrl: 'receive-car.html',
})
export class receiveCarPage {
    showRecieveCar: boolean = false;
    showRepareCar: boolean = false;
    isNave: boolean = false;
    public moreData = true;
    flag: boolean = false;
    moreFlag: boolean = true;
    first_flag: boolean = true;
    pet: string = "";
    seachInfo: any = { keyWords: '', pageSize: '', pageNo: '' };
    customers: customer[] = [
    ];
    showList: boolean = true;
    permissionData;
    constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, public changeDetectorRef: ChangeDetectorRef, private csNave: CsbzNave, private event: Events) {
        this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
        this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
        if (this.navParams.get('keyWords')) {
            let keyWord = this.navParams.get('keyWords');
            keyWord = decodeURIComponent(keyWord);
            if (csbzNave.checkCarNo(keyWord)) {
                // this.seachInfo.keyWords = keyWord;
                this.searchCar(keyWord);
                // alert(keyWord);
            }
        }

        if (this.navParams.get('home')) {
            this.csNave.carIdSacn((id) => {
                this.searchCar(id);

            })
        }

      
        this.permissionData.forEach(element => {
            if (element.menuId == "202003") {
                let show = element.funcTags & 2;
                if (show == 2) {
                    this.showRecieveCar = true;
                    window.localStorage.setItem("showRecieveCar", "1");
                } else {
                    this.showRecieveCar = false;
                    window.localStorage.setItem("showRecieveCar", "0");
                }

            }
            if (element.menuId == "202004") {
                let show = element.funcTags & 2;
                if (show == 2) {
                    this.showRepareCar = true;
                } else {
                    this.showRepareCar = false;
                }
            }
        })
        if (this.showRecieveCar) {
            this.pet = "common";
        } else {
            this.pet = "conduct";
        }
    }
    ionViewDidLoad() {
    }
    selectItem(type, customer?: customer) {
        if (this.pet == 'conduct') {
            this.navCtrl.push(newCarEditPage, { customerType: type, carNum: this.seachInfo.keyWords });
        } else if (this.pet == 'common') {
            this.navCtrl.push(orderItemPage, { customer: customer, customerType: type, carNum: this.seachInfo.keyWords });
        } else if (this.pet == 'clean') {
            this.navCtrl.push(washCarPage, { customer: customer, customerType: type, carNum: this.seachInfo.keyWords });
        }
    }
    selectConductItem(type, customer?: customer) {
        this.navCtrl.push(carConductPage, { customer: customer, customerType: type, carNum: this.seachInfo.keyWords });
    }

    // getCarInfo(params) {
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
    //     this.seachInfo.pageNo = 1;
    //     this.customers = [];
    //     this.searchCar(carNo.value);
    // }
    // searchCar(carNo) {
    //     if (carNo) {
    //         this.seachInfo.keyWords = carNo;
    //     }
    //     let self = this;
    //     return new Promise(function (resolve, reject) {
    //         self.websites.httpPost('findMemberAuto', self.seachInfo, false).subscribe(res => {
    //             if (!res) {
    //                 self.moreData = false;
    //                 self.customers = [];
    //                 self.flag = false;
    //                 self.first_flag = false;
    //                 resolve();
    //                 return
    //             }
    //             for (let i = 0; i < res.length; i++) {
    //                 self.customers.push(res[i]);
    //             }
    //             if (res.length < self.seachInfo.pageSize) {
    //                 self.moreData = false;
    //             } else {
    //                 self.moreData = true;

    //             }
    //             self.flag = true;
    //             self.first_flag = false;
    //             resolve();

    //             //self.changeDetectorRef.detectChanges();
    //         })
    //     })


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
    closewin() {
        this.csbzNave.closewin();
    }
    scanner() {
        this.csbzNave.carIdSacn(id => {
            this.searchCar(id);
        })
    }
    // closewin() {
    //     this.csbzNave.closewin();
    // }
    // scanner() {
    //     this.csbzNave.carIdSacn(id => {
    //         this.searchCar(id);
    //     })
    // }
    //上拉刷新
    // doInfinite(infiniteScroll) {
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
}

