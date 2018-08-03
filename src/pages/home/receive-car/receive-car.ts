
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { orderItemPage } from './order-item/order-item'
import { WebSites } from '../../../providers/web-sites'
import { carConductPage } from './car-conduct/car-conduct';
import { CsbzNave } from '../../../providers/csbz-nave';
import { newCarEditPage } from './new-car-edit/new-car-edit';
import { washCarPage } from './wash-car/wash-car';
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
    isNave: boolean = false;
    flag: boolean = false;
    moreFlag: boolean = true;
    first_flag: boolean = true;
    pet: string = "common";
    seachInfo: any = { keyWords: '', pageSize: '', pageNo: '' };
    customers: customer[] = [
    ];
    showList: boolean = true;
    constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public csbzNave: CsbzNave, public changeDetectorRef: ChangeDetectorRef,private csNave:CsbzNave) {
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

        if (this.navParams.get('home')) {
            this.csNave.carIdSacn((id) => {
                this.searchCar(id);
              })
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
    searchCar(carNo) {
        if (carNo) {
            this.seachInfo.keyWords = carNo;
        }
        let seachInfo = {
            keyWords: this.seachInfo.keyWords,
            pageSize: 10,
            pageNo: this.seachInfo.pageNo
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
}

