import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController  } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { CsModal } from '../../../../providers/cs-modal';
import { SupplementaryInfoPage } from '../supplementary-info/supplementary-info';
import { ReservationListPage } from '../reservation-list/reservation-list';
import {PaymentPolicyPage } from '../payment-policy/payment-policy';
import { SmsPopoverPage } from '../../../other/sms-popover/sms-popover';
declare let cordova: any;

/**
 * Generated class for the DetailPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-policy',
  templateUrl: 'detail-policy.html',
})
export class DetailPolicyPage {

  public isShowOrHide: any;//控制不同状态的显示
  public orderId;//订单id
  public lookMoreFlag1: boolean = true;//查看更多 true--隐藏更多 false--展示更多
  public lookMoreFlag2: boolean = true;//查看更多 true--隐藏更多 false--展示更多
  public moreMsg = '查看更多信息';
  public qryOrderInfo = <object>{};//用户数据;
  public insureenumval = {//险种信息
    sanZhe: {},
    boLi: {},
    chengKe: {},
    huaHen: {},
    siJi: {},
    hcXiulichang: {}
  };
  public epolicyList = [];
  public isBusinessStartDate: boolean = true;//商业险的具体险种显示 true--影藏 false--展示
  public isContentShow: boolean = false;
  /**
   * 1--已退回/保单详情
   * 2--待核保/保单详情
   */
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private webSites: WebSites,
    public csModal: CsModal,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) {
    this.isShowOrHide = this.navParams.get('btnFlag');
    this.orderId = this.navParams.get('orderId');
    if(this.isShowOrHide==8 || this.isShowOrHide==9){
      this.lookMoreFlag1 = true;
      this.lookMoreFlag2 = false;
    }else{
      this.lookMoreFlag1 = false;
      this.lookMoreFlag2 = true;
    }
    this.init();
  }

  //查看/收起更多(已支付/确定收单)
  lookMore1(){
    this.lookMoreFlag1 = !this.lookMoreFlag1;
    this.moreMsg = this.lookMoreFlag1 ? '查看更多信息' : '收起更多信息';
  }

  //查看/收起更多(资料不齐/无法核价/已报价未核保/核保中/已报价/待支付/未支付/15天无反馈/待支付)
  lookMore2(){
    this.lookMoreFlag2 = !this.lookMoreFlag2;
    this.moreMsg = this.lookMoreFlag2 ? '查看更多信息' : '收起更多信息';
  }

  //获取数据
  init(){
    this.webSites.httpPost('getInsureenumval', {})
    .subscribe(
      res => {
        var data = res;
        for (var i in data.sanZhe) {
          this.insureenumval.sanZhe[data.sanZhe[i].enumValue] = data.sanZhe[i].enumKey;
        };
        for (var i in data.boLi) {
          this.insureenumval.boLi[data.boLi[i].enumValue] = data.boLi[i].enumKey;
        };
        for (var i in data.chengKe) {
          this.insureenumval.chengKe[data.chengKe[i].enumValue] = data.chengKe[i].enumKey;
        };
        for (var i in data.huaHen) {
          this.insureenumval.huaHen[data.huaHen[i].enumValue] = data.huaHen[i].enumKey;
        };
        for (var i in data.siJi) {
          this.insureenumval.siJi[data.siJi[i].enumValue] = data.siJi[i].enumKey;
        };
        for (var i in data.xiulichangType) {
          this.insureenumval.hcXiulichang[data.xiulichangType[i].enumValue] = data.xiulichangType[i].enumKey;
        }
      }
    );
    this.webSites.httpPost('qryOrderInfo', {'orderId':this.orderId})
    .subscribe(
      res => {
        this.isContentShow = true;
        this.qryOrderInfo = res;
        this.qryOrderInfo['sanZhe'] = this.insureenumval['sanZhe'][this.qryOrderInfo['sanZhe']];
        this.qryOrderInfo['boLi'] = this.insureenumval['boLi'][this.qryOrderInfo['boLi']];
        this.qryOrderInfo['chengKe'] = this.insureenumval['chengKe'][this.qryOrderInfo['chengKe']];
        this.qryOrderInfo['huaHen'] = this.insureenumval['huaHen'][this.qryOrderInfo['huaHen']];
        this.qryOrderInfo['siJi'] = this.insureenumval['siJi'][this.qryOrderInfo['siJi']];
        this.qryOrderInfo['hcXiulichang'] = this.insureenumval['hcXiulichang'][this.qryOrderInfo['hcXiulichang']];
        this.qryOrderInfo['daoQiang'] = this.qryOrderInfo['daoQiang'] == 0 ? '不投保' : this.qryOrderInfo['daoQiang'];
        this.qryOrderInfo['ziRan'] = this.qryOrderInfo['ziRan'] == 0 ? '不投保' : this.qryOrderInfo['ziRan'];
        this.qryOrderInfo['sheShui'] = this.qryOrderInfo['sheShui'] == 0 ? '不投保' : this.qryOrderInfo['sheShui'];
        this.qryOrderInfo['cheSun'] = this.qryOrderInfo['cheSun'] == 0 ? '不投保' : this.qryOrderInfo['cheSun'];
        this.qryOrderInfo['hcSanfangteyue'] = this.qryOrderInfo['hcSanfangteyue'] == 0 ? '不投保' : '投保';

        if (this.qryOrderInfo['epolicy'] != null) {
          this.epolicyList.push({
            imageSrc: this.qryOrderInfo['epolicy']
          });
        }
        if (this.qryOrderInfo['epolicy2'] != null) {
          this.epolicyList.push({
            imageSrc: this.qryOrderInfo['epolicy2']
          });
        }
        if (this.qryOrderInfo['epolicy3'] != null) {
          this.epolicyList.push({
            imageSrc: this.qryOrderInfo['epolicy3']
          });
        }
      },
      err => {
        this.isContentShow = false;
      }
    );
  }

  // 补充资料
  goSupplementaryInfo(orderId){
    if (orderId != null) {
      this.navCtrl.push(SupplementaryInfoPage, { 'orderId': orderId });
    } else {
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //预约出单
  toFillInfo = function(orderId) {
    if (orderId != null) {
      this.navCtrl.push(ReservationListPage, { 'orderId': orderId });
    } else {
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  //立即支付
  toPayOrder = function(orderId) {
    if (orderId != null) {
      this.navCtrl.push(PaymentPolicyPage, { orderId: orderId });
    } else {
      this.csModal.showAlert('缺少参数', '', '', '确定', '', '');
    }
  }

  // 申请核保
  toSupplementaryInfo = function(orderId) {
    this.navCtrl.push(SupplementaryInfoPage, { 'orderId': orderId });
  };

  //确定收单
  confirmOrder = function(oid) {
    let alert = this.alertCtrl.create({
      title: '收单提示',
      subTitle: '您确定已收到保单快递？',
      buttons: [
        {
          text: '取消',
        },
        {
          text: '确定',
          handler: () => {
            this.webSites.httpPost('issuingOrder',{
              'orderId': oid,
            })
            .subscribe(res => {
              this.csModal.showAlert('收单成功', '', '', '确定', '', '')
            })
            .then(
              this.csModal.showAlert('收单失败', '', '', '确定', '', '')
            );
          }
        }
      ]
    });
    alert.present(); 
  };

  //发送短信
  sendSMS = function(oId) {
    this.webSites.httpPost('qryMessage',{'orderId': oId})
    .subscribe(res => {
      let smsModal = this.modalCtrl.create(SmsPopoverPage,{
        'postMsg': res
      },{
        enableBackdropDismiss: true,
        showBackdrop: true,
        cssClass: 'smsModal'
      });
      smsModal.onDidDismiss();
      smsModal.present();
    });
  }

  intercept(str){
    let str1 = str.split("/")[2];
    let str2 = str1.split(".")[0];
    return str2;
  }

  //查看图片
  photoView(showTypeId){
    let item = [];
    if(showTypeId == 0){
      if (this.qryOrderInfo['drivingLicense'] != null) {
        let url = this.intercept(this.qryOrderInfo['drivingLicense']);
        item.push({
          'url': url,
        });
      }
    }else if(showTypeId == 1){
      if (this.qryOrderInfo['insuredIdCardPhoto'] != null) {
        let url = this.intercept(this.qryOrderInfo['insuredIdCardPhoto']);
        item.push({
          'url': url,
        });
      }
    }else if(showTypeId == 2){
      if (this.qryOrderInfo['carInvoicePhoto'] != null) {
        let url = this.intercept(this.qryOrderInfo['carInvoicePhoto']);
        item.push({
          'url': url,
        });
      }
    }else if(showTypeId == 3){
      if (this.qryOrderInfo['carvinPhoto'] != null) {
        let url = this.intercept(this.qryOrderInfo['carvinPhoto']);
        item.push({
          'url': url,
        });
      }
    }else if(showTypeId == 4){
      if (this.qryOrderInfo['carbodyPhoto1'] != null) {
        let url = this.intercept(this.qryOrderInfo['carbodyPhoto1']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['carbodyPhoto2'] != null) {
        let url = this.intercept(this.qryOrderInfo['carbodyPhoto2']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['carbodyPhoto3'] != null) {
        let url = this.intercept(this.qryOrderInfo['carbodyPhoto3']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['carbodyPhoto4'] != null) {
        let url = this.intercept(this.qryOrderInfo['carbodyPhoto4']);
        item.push({
          'url': url,
        });
      }
    }else if(showTypeId == 5){
      if (this.qryOrderInfo['otherPhoto'] != null) {
        let url = this.intercept(this.qryOrderInfo['otherPhoto']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['otherPhoto2'] != null) {
        let url = this.intercept(this.qryOrderInfo['otherPhoto2']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['otherPhoto3'] != null) {
        let url = this.intercept(this.qryOrderInfo['otherPhoto3']);
        item.push({
          'url': url,
        });
      }
    }else{
      if (this.qryOrderInfo['epolicy'] != null) {
        let url = this.intercept(this.qryOrderInfo['epolicy']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['epolicy2'] != null) {
        let url = this.intercept(this.qryOrderInfo['epolicy2']);
        item.push({
          'url': url,
        });
      }
      if (this.qryOrderInfo['epolicy3'] != null) {
        let url = this.intercept(this.qryOrderInfo['epolicy3']);
        item.push({
          'url': url,
        });
      }
    }
    if(item.length == 0){
      return ;
    }
    return ;
    // cordova.plugins.PhotoView.show({ imageArr: item, index: showTypeId }, (res) => {
    //   console.log(res);
    // }, (error) => {
    //   console.log(error);
    // })
  }

}
