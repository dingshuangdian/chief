import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { companyPopover } from '../../../other/company-popover/company-popover';
import { RequotationPage } from '../requotation/requotation';

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
  userInfo;//用户信息

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private websize: WebSites, 
    private popoverCtrl: PopoverController,
  ) {
  }

  ionViewDidLoad() {
    this.userInfo = JSON.parse(localStorage.getItem('storeInfo'));
    this.getcxData();
    this.getInsuranceComList();

  }

  //获取到期车辆列表
  getcxData() {
    this.websize.httpPost('getExpireInsuranceList', {},true).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }

  //获取保险公司列表
  getInsuranceComList() {
    this.websize.httpPost('getInsuranceComList', {}).subscribe(res => {
      if (res) {
        this.InsuranceComList = res;
        this.companyName = this.InsuranceComList[0].companyName;
      }

    })
  }

  //弹窗下拉选择保险公司
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

  //时间升序/降序
  sord() {
    this.upordown = this.upordown == "arrow-down" ? "arrow-up" : "arrow-down";
    let sordd = this.upordown == "arrow-down" ? 'asc' : 'desc';
    this.websize.httpPost('getExpireInsuranceList', { sord: sordd }).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }

  //搜索框
  searchInsur(text) {
    this.licenseNo = text;
    this.websize.httpPost("getExpireInsuranceList", { licenseNo: text }).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }

  //险种选择
  goSelectSurrence(cityCode, licenseNo){
    this.navCtrl.push(RequotationPage, {
      'licenseNo': licenseNo,
      'cityCode': cityCode,
      'agentName': this.userInfo.userName,
      'userId': this.userInfo.userId,
      'requotationType': 1
    });
  }

  //下拉刷新
  doRefresh(event){
    this.websize.httpPost('getExpireInsuranceList', {}).subscribe(res => {
      if (res) {
        event.complete();
        this.cxData = res.rows;
      }
    })
  }
}
