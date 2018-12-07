import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { QuotationDetailPage } from '../quotation-detail/quotation-detail';
import { WebSites } from '../../../../providers/web-sites';
import { CarInsProgressPage } from '../car-ins-progress/car-ins-progress';

/**
 * Generated class for the SelInsuranceCompPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sel-insurance-comp',
  templateUrl: 'sel-insurance-comp.html',
})
export class SelInsuranceCompPage {

  selInsCompType: any;
  carOrArtificial;
  companyList;
  companySelect;//选中的保险公司对象
  paramsList;
  listParams = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private websize: WebSites,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public webSites: WebSites,
    public loadingCtrl: LoadingController,
  ) {
    if (this.navParams.get("carOrArtificial")) {
      this.carOrArtificial = this.navParams.get("carOrArtificial");
      this.paramsList = this.carOrArtificial.list;
    }
  }

  ionViewDidLoad() {
    this.getInsuranceCompanies();
  }

  //获取保险公司列表
  getInsuranceCompanies() {
    this.websize.httpPost("getInsuranceCompanies", { cityCode: this.carOrArtificial.list.cityCode }, true).subscribe(res => {
      if (res) {
        this.companyList = res;
        this.companySelect = this.companyList[0];
      }
    })
  }

  //下一步
  toPlccOfferDetails() {
    let quoteGroup = this.companySelect.companyId;//选中的保险公司id
    let insuranceCompanyList = [{//选中的保险公司对象信息
      'insuranceCompanyId': this.companySelect.companyId,
      'companyCatgory': this.companySelect.companyCatgory,
    }]
    if (this.carOrArtificial.router == 1 || this.carOrArtificial.router == 3) { //自动或重新报价
      let paramsLists = {
        cityCode: this.paramsList.cityCode,
        insureAgentUid: this.paramsList.insureAgentUid,
        insureAgentUname: this.paramsList.insureAgentUname,
        licenseNo: this.paramsList.licenseNo,
        carownerName: this.paramsList.carownerName,
        carownerCard: this.paramsList.carownerCard,
        carVin: this.paramsList.carVin,
        engineNo: this.paramsList.engineNo,
        modleName: this.paramsList.modleName,
        registerDate: this.paramsList.registerDate,
        holderPartytype: this.paramsList.holderPartytype,
        holderName: this.paramsList.holderName,
        holderIdCard: this.paramsList.holderIdCard,
        holderMobile: this.paramsList.holderMobile,
        holderIdCardType: this.paramsList.holderIdCardType,
        insuredName: this.paramsList.insuredName,
        insuredIdCard: this.paramsList.insuredIdCard,
        insuredMobile: this.paramsList.insuredMobile,
        insuredIdCardType: this.paramsList.insuredIdCardType,
        forceStartDate: this.paramsList.forceStartDate,
        businessStartDate: this.paramsList.businessStartDate,
        seatCount: this.paramsList.seatCount,
        force: this.paramsList.force,
        cheSun: this.paramsList.cheSun,
        bujimianChesun: this.paramsList.bujimianChesun,
        sanZhe: this.paramsList.sanZhe,
        bujimianSanzhe: this.paramsList.bujimianSanzhe,
        daoQiang: this.paramsList.daoQiang,
        bujimianDaoqiang: this.paramsList.bujimianDaoqiang,
        siJi: this.paramsList.siJi,
        bujimianSiji: this.paramsList.bujimianSiji,
        chengKe: this.paramsList.chengKe,
        bujimianChengke: this.paramsList.bujimianChengke,
        boLi: this.paramsList.boLi,
        huaHen: this.paramsList.huaHen,
        bujimianHuahen: this.paramsList.bujimianHuahen,
        sheShui: this.paramsList.sheShui,
        bujimianSheshui: this.paramsList.bujimianSheshui,
        ziRan: this.paramsList.ziRan,
        bujimianZiran: this.paramsList.bujimianZiran,
        hcSanfangteyue: this.paramsList.hcSanfangteyue,
        hcXiulichangType: this.paramsList.hcXiulichangType,
        hcXiulichang: this.paramsList.hcXiulichang,
        insuranceCompanyList: JSON.stringify(insuranceCompanyList),
        quoteGroup: quoteGroup,
        memo: this.paramsList.memo,
        autoMoldcode: this.paramsList.autoMoldcode,
        purchasePrice: this.paramsList.purchasePrice,
        exhaustScale: this.paramsList.exhaustScale
      };
      this.listParams['list'] = paramsLists;
      this.listParams['router'] = 4;
      this.navCtrl.push(QuotationDetailPage, { listParams: this.listParams });
    } else { //人工报价或修改保单

      if (!this.paramsList.insuredName) {
        this.paramsList.insuredName = '';
      }
      if (!this.paramsList.insuredMobile) {
        this.paramsList.insuredMobile = '';
      }
      if (!this.paramsList.insuredIdCard) {
        this.paramsList.insuredIdCard = '';
      }
      if (!this.paramsList.insuredIdCardType) {
        this.paramsList.insuredIdCardType = '';
      }
      let paramsLists = {
        cityCode: this.paramsList.cityCode,
        insureAgentUid: this.paramsList.insureAgentUid,
        insureAgentUname: this.paramsList.insureAgentUname,
        licenseNo: this.paramsList.licenseNo,
        holderName: this.paramsList.holderName,
        holderIdCard: this.paramsList.holderIdCard,
        holderMobile: this.paramsList.holderMobile,
        holderIdCardType: this.paramsList.holderIdCardType,
        insuredName: this.paramsList.insuredName,
        insuredIdCard: this.paramsList.insuredIdCard,
        insuredMobile: this.paramsList.insuredMobile,
        insuredIdCardType: this.paramsList.insuredIdCardType,
        forceStartDate: this.paramsList.forceStartDate,
        businessStartDate: this.paramsList.businessStartDate,
        seatCount: this.paramsList.seatCount,
        force: this.paramsList.force,
        cheSun: this.paramsList.cheSun,
        bujimianChesun: this.paramsList.bujimianChesun,
        sanZhe: this.paramsList.sanZhe,
        bujimianSanzhe: this.paramsList.bujimianSanzhe,
        daoQiang: this.paramsList.daoQiang,
        bujimianDaoqiang: this.paramsList.bujimianDaoqiang,
        siJi: this.paramsList.siJi,
        bujimianSiji: this.paramsList.bujimianSiji,
        chengKe: this.paramsList.chengKe,
        bujimianChengke: this.paramsList.bujimianChengke,
        boLi: this.paramsList.boLi,
        huaHen: this.paramsList.huaHen,
        bujimianHuahen: this.paramsList.bujimianHuahen,
        sheShui: this.paramsList.sheShui,
        bujimianSheshui: this.paramsList.bujimianSheshui,
        ziRan: this.paramsList.ziRan,
        bujimianZiran: this.paramsList.bujimianZiran,
        hcSanfangteyue: this.paramsList.hcSanfangteyue,
        hcXiulichangType: this.paramsList.hcXiulichangType,
        hcXiulichang: this.paramsList.hcXiulichang,
        insuranceCompanyList: JSON.stringify(insuranceCompanyList),
        quoteGroup: quoteGroup,
        memo: this.paramsList.memo,
        carownerMobile: "",
        quoteTypeId: "",
        insuredIdCardPhotoImg: "",
        insuredIdCardPhotoImg_name: "",
        drivingLicenseImg: "",
        drivingLicenseImg_name: "",
        carInvoicePhotoImg: "",
        carInvoicePhotoImg_name: "",
        carbodyPhotoImg1: "",
        carbodyPhotoImg1_name: "",
        carbodyPhotoImg2: "",
        carbodyPhotoImg2_name: "",
        carbodyPhotoImg3: "",
        carbodyPhotoImg3_name: "",
        carbodyPhotoImg4: "",
        carbodyPhotoImg4_name: "",
        carvinPhotoImg: "",
        carvinPhotoImg_name: "",
        otherPhotoImg1: "",
        otherPhotoImg1_name: "",
        otherPhotoImg2: "",
        otherPhotoImg2_name: "",
        otherPhotoImg3: "",
        otherPhotoImg3_name: "",
        underwritingPhotoImg1: "",
        underwritingPhotoImg1_name: "",
        underwritingPhotoImg2: "",
        underwritingPhotoImg2_name: "",
        underwritingPhotoImg3: "",
        underwritingPhotoImg3_name: "",
        businessLicenseImg: "",
        businessLicenseImg_name: "",
        agentPhotoImg1: "",
        agentPhotoImg1_name: "",
        agentPhotoImg2: "",
        agentPhotoImg2_name: "",
        agentSignPhotoImg: "",
        agentSignPhotoImg_name: ""
      };
      if (this.carOrArtificial.router == 2) {
        this.artificialQuotation(paramsLists); //人工报价
      } else if (this.carOrArtificial.router == 6) { //修改保单
        paramsLists['orderId'] = this.paramsList.orderId;
        this.modifyInscuranceOrder(paramsLists);
      }
    }
  };
  artificialQuotation(paramsLists) { //人工报价
    this.websize.httpPost('artificialQuotation', paramsLists, true).subscribe(res => {
      if (res) {
        console.log(res);
        this.showAlert('资料提交成功，等待人工核保');
        this.navCtrl.push(CarInsProgressPage, { num: 1 })
      }

    })
  };
  modifyInscuranceOrder(paramsLists) { //修改保单
    this.websize.httpPost('modifyInscuranceOrder', paramsLists
    ).subscribe(res => {
      if (res) {
        this.showAlert('修改成功！');
        this.navCtrl.push(CarInsProgressPage, { num: 1 })
      }
    })
  };

  showAlert(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
}
