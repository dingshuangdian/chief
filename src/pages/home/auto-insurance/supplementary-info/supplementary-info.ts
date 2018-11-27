import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PhotoExPage } from '../photo-ex/photo-ex';
import {CsbzNave } from '../../../../providers/csbz-nave';
import { WebSites } from '../../../../providers/web-sites';
import { CsModal } from '../../../../providers/cs-modal';

/**
 * Generated class for the SupplementaryInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-supplementary-info',
  templateUrl: 'supplementary-info.html',
})
export class SupplementaryInfoPage {

  orderId: string;//订单号
  quoteType = 1;//报价类型 1--个人 2--单位
  isSubmit: boolean = true;//提交按钮是否能用 true--不能用 false--能用
  insuredIdCardPhoto: any = [//身份证
    {'url': 'assets/imgs/padd.png','blob': ''},
  ]
  businessLicense: any = [//企业营业执照;
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  drivingLicensesPhoto: any = [//机动车行驶证
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  underwritingPhotos = [//核保所需照片
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  agentSignPhoto: any = [//代办人签署投保单照片
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  verificationCarPhotos: any = [//验车照
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''}
  ];
  otherDocumentsPhotos: any = [//其他证件
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  lookMore: string="查看更多信息";
  lookMoreFlag: boolean = true;//查看更多 true--隐藏 false--显示

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public csbzNave: CsbzNave,
    public webSites: WebSites,
    public csModal: CsModal,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.orderId = this.navParams.get('orderId');
  }

  // 查看更多
  lookMoreBtn(){
    this.lookMoreFlag = !this.lookMoreFlag;
    if(this.lookMoreFlag){
      this.lookMore = '查看更多信息';
    }else{
      this.lookMore = '收起';
    }
  }

  //查看拍图示例
  goEx(){
    this.navCtrl.push(PhotoExPage);
  }

  // 从相机/相册中选中图片
  getPicture(obj,i) {
    this.csbzNave.selecPicture((data) => {
      if (!data.msg) {//上传图片成功
        this.isSubmit = false;
        obj[i].url = data.imageSrc;
        obj[i].blob = data.imageBlob;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  //提交
  submit(){
    let param: any = {};
    param.orderId = this.orderId;
    param.quoteType = this.quoteType;
    // 身份证
    param.insuredIdCardPhotoImg = this.insuredIdCardPhoto[0].blob;
    param.insuredIdCardPhotoImg_name = '1.png';
    // 企业营业执照
    param.businessLicenseImg = this.businessLicense[0].blob;
    param.businessLicenseImg_name = '22.png';
    //机动车行驶证
    param.drivingLicenseImg = this.drivingLicensesPhoto[0].blob;
    param.drivingLicenseImg_name = '2.png';
    //核保所需照片
    param.underwritingPhotoImg1 = this.underwritingPhotos[0].blob;
    param.underwritingPhotoImg1_name = '19.png';
    param.underwritingPhotoImg2 = this.underwritingPhotos[1].blob;
    param.underwritingPhotoImg2_name = '20.png';
    param.underwritingPhotoImg3 = this.underwritingPhotos[2].blob;
    param.underwritingPhotoImg3_name = '21.png';
    // 代办人签署投保单照片
    param.agentSignPhotoImg = this.agentSignPhoto[0].blob;
    param.agentSignPhotoImg_name = '25.png';
    //验车照
    param.carbodyPhotoImg1 = this.verificationCarPhotos[0].blob;
    param.carbodyPhotoImg1_name = '11.png';
    param.carbodyPhotoImg2 = this.verificationCarPhotos[1].blob;
    param.carbodyPhotoImg2_name = '12.png';
    param.carbodyPhotoImg3 = this.verificationCarPhotos[2].blob;
    param.carbodyPhotoImg3_name = '13.png';
    param.carbodyPhotoImg4 = this.verificationCarPhotos[3].blob;
    param.carbodyPhotoImg4_name = '14.png';
    param.carbodyPhotoImg5 = this.verificationCarPhotos[4].blob;
    param.carbodyPhotoImg5_name = '15.png';
    //其他证件
    param.otherPhotoImg1 = this.otherDocumentsPhotos[0].blob;
    param.otherPhotoImg1_name = '8.png';
    param.otherPhotoImg2 = this.otherDocumentsPhotos[1].blob;
    param.otherPhotoImg2_name = '9.png';
    param.otherPhotoImg3 = this.otherDocumentsPhotos[2].blob;
    param.otherPhotoImg4_name = '10.png';
    this.webSites.httpPost('supplementaryInformation',param)
    .subscribe(res => {
      this.csModal.showAlert('提交成功!','','','确定','','');
    });
  }

}
