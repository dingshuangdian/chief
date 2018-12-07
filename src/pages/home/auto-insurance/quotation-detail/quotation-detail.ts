import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ReservationListPage } from '../reservation-list/reservation-list';
import { SupplementaryInfoPage } from '../supplementary-info/supplementary-info';
import { WebSites } from '../../../../providers/web-sites';
import { CsModal } from '../../../../providers/cs-modal';
import { AutoInsurancePage } from '../auto-insurance';
import { SmsPopoverPage } from '../../../other/sms-popover/sms-popover';

/**
 * Generated class for the QuotationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-quotation-detail',
  templateUrl: 'quotation-detail.html',
})
export class QuotationDetailPage {

  listParams;
  insuranceCompanyList;//选择的保险公司
  quotationList;//上一个页面传递过来的参数对象中的list对象
  licenseNo;//车牌号
  carVin;
  errorReport;
  iserrorReport;
  orderId;//订单id
  id;
  btnWord;//按钮状态 1--预约出单 else--申请核保
  hebaoModel;//核保信息
  insuranceCompanyId;//选择的保险公司id
  isShowFooter;//是否显示底部 true--显示 false--不显示
  insureAgentUname;//代理专员
  insureenumval = {//保险信息
    sanZhe: {},
    boLi: {},
    chengKe: {},
    huaHen: {},
    siJi: {},
    hcXiulichang: {}
  }
  info: any = {};// 车辆报价信息
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private websize: WebSites,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public csModal: CsModal,
  ) {
    this.listParams = this.navParams.get('listParams');
  }

  ionViewDidLoad() {
    this.getInsureenumval();
  }
  getInsureenumval() {
    this.websize.httpPost("getInsureenumval", {},true).subscribe(res => {
      if (res) {
        for (var i in res.sanZhe) {
          this.insureenumval.sanZhe[res.sanZhe[i].enumValue] = res.sanZhe[i].enumKey;
        };
        for (var i in res.boLi) {
          this.insureenumval.boLi[res.boLi[i].enumValue] = res.boLi[i].enumKey;
        };
        for (var i in res.chengKe) {
          this.insureenumval.chengKe[res.chengKe[i].enumValue] = res.chengKe[i].enumKey;
        };
        for (var i in res.huaHen) {
          this.insureenumval.huaHen[res.huaHen[i].enumValue] = res.huaHen[i].enumKey;
        };
        for (var i in res.siJi) {
          this.insureenumval.siJi[res.siJi[i].enumValue] = res.siJi[i].enumKey;
        };
        for (var i in res.xiulichangType) {
          this.insureenumval.hcXiulichang[res.xiulichangType[i].enumValue] = res.xiulichangType[i].enumKey;
        }
      }
    })
    if (this.listParams.router == 4) {
      this.quotationList = this.listParams.list;
      this.licenseNo = this.quotationList.licenseNo;
      this.carVin = this.quotationList.carVin;
      this.insureAgentUname = this.quotationList.insureAgentUname;
      this.isShowFooter = true;
      this.insuranceCompanyList = JSON.parse(this.quotationList.insuranceCompanyList);
      for (var z in this.insuranceCompanyList) {
        this.insuranceCompanyId = this.insuranceCompanyList[z].insuranceCompanyId;
        this.AutoQuotation();//自动报价
      };
    } else if (this.listParams.router == 5) {
      this.licenseNo = this.listParams.list.licenseNo;
      this.carVin = this.listParams.list.carVin;
      this.insureAgentUname = this.listParams.list.insureAgentUname;
      this.insuranceCompanyId = this.listParams.list.quoteGroup;
      this.isShowFooter = false;
      this.autoInsuranceRenewal();// 一键续保
    }

  }
  //自动报价
  AutoQuotation() {
    this.websize.httpPost('AutoQuotation', this.quotationList).subscribe(res => {
      if (res) {
        this.getQuoteInfo();
      }
    })
  }

  //获取车辆报价信息
  getQuoteInfo() {
    this.websize.httpPost('getQuoteInfo', { licenseNo: this.licenseNo, quoteGroup: this.insuranceCompanyId }).subscribe(res => {
      if (res) {
        if (res.QuoteStatus == 0 || res.QuoteStatus == -1) {
          this.presentToast(res.QuoteResult);
          this.navCtrl.popTo(AutoInsurancePage);
        } else {
          this.info = res;
          this.info['sanZhe'] = this.insureenumval['sanZhe'][this.info['sanZhe']];
          this.info['boLi'] = this.insureenumval['boLi'][this.info['boLi']];
          this.info['chengKe'] = this.insureenumval['chengKe'][this.info['chengKe']];
          this.info['huaHen'] = this.insureenumval['huaHen'][this.info['huaHen']];
          this.info['siJi'] = this.insureenumval['siJi'][this.info['siJi']];
          this.info['hcXiulichang'] = this.insureenumval['hcXiulichang'][this.info['hcXiulichang']];
          this.info['daoQiang'] = this.info['daoQiang'] == 0 ? '不投保' : this.info['daoQiang'];
          this.info['ziRan'] = this.info['ziRan'] == 0 ? '不投保' : this.info['ziRan'];
          this.info['sheShui'] = this.info['sheShui'] == 0 ? '不投保' : this.info['sheShui'];
          this.info['cheSun'] = this.info['cheSun'] == 0 ? '不投保' : this.info['cheSun'];
          this.info['hcSanfangteyue'] = this.info['hcSanfangteyue'] == 0 ? '不投保' : '投保';
          this.orderId = this.info['orderId'];
          if (this.listParams.router == 4) {
            this.getQuoteSubmitInfo();
          }
        }
      }
    })
  }

  // 一键续保
  autoInsuranceRenewal() {
    this.presentLoading('正在获取续保信息，请稍候......');
        this.websize.httpPost('autoInsuranceRenewal', {
            licenseNo: this.licenseNo
        }).subscribe(
          function(res) {
            this.getQuoteInfo();
          }, 
          function(error) {
            if (error.status < 0) {
              this.presentLoading.dismiss();
              this.csModal.showAlert('请求超时', function() {
                this.navCtrl.push('AutoInsurancePage');
              }, '', '确定', '', '');
            }else{
              this.presentLoading.dismiss();
              this.csModal.showAlert('缺少参数', function(){
                this.navCtrl.push('AutoInsurancePage');
              }, '', '确定', '', '');

            }
        })
  }

  //获取车辆核保信息
  getQuoteSubmitInfo() {
    this.websize.httpPost('getQuoteSubmitInfo', {
      licenseNo: this.licenseNo,
      quoteGroup: this.insuranceCompanyId
    }).subscribe(res => {
      if (res) {
        if (res.SubmitStatus == 1) {
          this.iserrorReport = false;
          this.id = 2;
          this.hebaoModel = '已核保';
          this.btnWord = '预约出单';
        } else if (res.SubmitStatus == 2) {
          this.iserrorReport = false;
          this.presentToast('未到期未核保');
        } else {
          this.iserrorReport = true;
          this.errorReport = res.SubmitResult;
          this.id = 1;
          this.hebaoModel = '未核保';
          this.btnWord = '申请核保';
        }
      }
    })
  }

  //弹窗
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  //加载...
  presentLoading(msg) {
    let loading = this.loadingCtrl.create({
      content: msg
    });
    loading.present();
    return loading;
  }

  //发送短信
  sendSMS() {
    this.websize.httpPost('qryMessage',{'orderId': this.orderId})
    .subscribe(res => {
      let smsModal = this.modalCtrl.create(SmsPopoverPage,{
        'postMsg': res
      },{
        enableBackdropDismiss: true,
        showBackdrop: true,
        cssClass: 'smsModal'
      });
      smsModal.onDidDismiss(data => {});
      smsModal.present();
    });
  }

  //预约出单 / 申请核保
  toUploadData = function(id) {
    if (id == 1) {
      this.navCtrl.push(SupplementaryInfoPage, { orderId: this.orderId });
    } else {
      this.navCtrl.push(ReservationListPage, { orderId: this.orderId });
    }
  };
}
