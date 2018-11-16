import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { companyPopover } from '../../../other/company-popover/company-popover';

/**
 * Generated class for the AllInsurancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-all-insurance',
  templateUrl: 'all-insurance.html',
})
export class AllInsurancePage {
  cxData = [];
  InsuranceComList;
  companyName;
  licenseNo;
  upordown: string = "arrow-down";

  constructor(public navCtrl: NavController, public navParams: NavParams, private websize: WebSites, private popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.getcxData();
    this.getInsuranceComList();

  }
  getcxData() {
    this.websize.httpGet('getExpireInsuranceList', {}).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }
  getInsuranceComList() {
    this.websize.httpGet('getInsuranceComList', {}, true).subscribe(res => {
      if (res) {
        this.InsuranceComList = res;
        this.companyName = this.InsuranceComList[0].companyName;
      }

    })
  }
  showCompany() {
    let popover = this.popoverCtrl.create(companyPopover, { t: this.InsuranceComList }, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (data) {
        this.companyName = data.companyName;
        this.websize.httpPost("getExpireInsuranceList", { insuranceComId: data.insuranceComId }).subscribe(res => {
          if (res) {
            this.cxData = res.rows;
          }

        })
      }
    });
    popover.present();
  }
  sord() {
    this.upordown = this.upordown == "arrow-down" ? "arrow-up" : "arrow-down";
    let sordd = this.upordown == "arrow-down" ? 'asc' : 'desc';
    this.websize.httpPost('getExpireInsuranceList', { sord: sordd }).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }
  searchInsur(text) {
    this.licenseNo = text;
    this.websize.httpPost("getExpireInsuranceList", { licenseNo: text }, false).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }
}
