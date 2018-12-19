import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RequotationPage } from '../requotation/requotation';
import { PhotoExPage } from '../photo-ex/photo-ex';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { CsModal } from '../../../../providers/cs-modal';

/**
 * Generated class for the ModifyPolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modify-policy',
  templateUrl: 'modify-policy.html',
})
export class ModifyPolicyPage {

  title: string = '人工报价';
  public segmentType = '1';//tab切换 1--人工报价 2--新车报价
  public quoteType = '1';//1--个人 2--单位
  insuredIdCardPhoto: any = [//身份证
    {'url': 'assets/imgs/padd.png','blob': ''},
  ]
  businessLicense: any = [//企业营业执照;
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  drivingLicensesPhoto: any = [//机动车行驶证
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  invoicePhoto: any = [//购车发票
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  underwritingPhotos = [//核保所需照片
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
    {'url': 'assets/imgs/padd.png','blob': ''},
  ];
  agentIdCardPhoto: any = [//代办人身份证
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
  cityCode; //城市编码
  agentName; //用户名字
  userId; //用户编码
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public csbzNave: CsbzNave,
    public csModal: CsModal,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    this.cityCode = this.navParams.get('cityCode');
    this.agentName = this.navParams.get('agentName');
    this.userId = this.navParams.get('userId');
  }

  ionViewDidLoad() {
  }

  //切换tab
  toggleTab(type){
    if(type == 1){
      this.title = '人工报价';
    }else{
      this.title = '新车报价'
    }
  } 

  // 查看更多
  lookMoreBtn(){
    this.lookMoreFlag = !this.lookMoreFlag;
    this.lookMore = this.lookMoreFlag ? '查看更多信息' : '收起更多资料';
  }

  //查看拍图示例
  goEx(){
    this.navCtrl.push(PhotoExPage);
  }

  // 从相机/相册中选中图片
  getPicture(obj,i) {
    this.csbzNave.selecPicture((data) => {
      if (!data.msg) {//上传图片成功
        obj[i].url = data.imageSrc;
        obj[i].blob = data.imageBlob;
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  // 下一步
  nextBtn() {
    if (this.quoteType == '1') {
      if (!this.insuredIdCardPhoto[0].blob || !this.drivingLicensesPhoto[0].blob) {
        this.csModal.showAlert('请上传投保人证件照或机动车行驶证!','','','确定','','');
        return false;
      }
    } else if (this.quoteType == '2') {
      if (!this.businessLicense[0].blob) {
        this.csModal.showAlert('请上传企业营业执照!','','','确定','','');
        return false;
      }
    }
    let param: any = {
      carownerMobile: '',
      cityCode: this.cityCode,
      agentName: this.agentName,
      userId: this.userId,
      router: 2,
      quoteTypeId: this.segmentType,

      insuredIdCardPhotoImg: this.insuredIdCardPhoto[0].blob,
      insuredIdCardPhotoImg_name: '1.png',

      carbodyPhotoImg1: this.verificationCarPhotos[0].blob,
      carbodyPhotoImg1_name: '11.png',
      carbodyPhotoImg2: this.verificationCarPhotos[1].blob,
      carbodyPhotoImg2_name: '12.png',
      carbodyPhotoImg3: this.verificationCarPhotos[2].blob,
      carbodyPhotoImg3_name: '13.png',
      carbodyPhotoImg4: this.verificationCarPhotos[3].blob,
      carbodyPhotoImg4_name: '14.png',
      carvinPhotoImg: this.verificationCarPhotos[4].blob,
      carvinPhotoImg_name: '15.png',

      otherPhotoImg1: this.otherDocumentsPhotos[0].blob,
      otherPhotoImg1_name: '16.png',
      otherPhotoImg2: this.otherDocumentsPhotos[1].blob,
      otherPhotoImg2_name: '17.png',
      otherPhotoImg3: this.otherDocumentsPhotos[2].blob,
      otherPhotoImg3_name: '18.png',

      underwritingPhotoImg1: this.underwritingPhotos[0].blob,
      underwritingPhotoImg1_name: '19.png',
      underwritingPhotoImg2: this.underwritingPhotos[1].blob,
      underwritingPhotoImg2_name: '20.png',
      underwritingPhotoImg3: this.underwritingPhotos[2].blob,
      underwritingPhotoImg3_name: '21.png',

      businessLicenseImg: this.businessLicense[0].blob,
      businessLicenseImg_name: '22.png',

      agentPhotoImg1: this.agentIdCardPhoto[0].blob,
      agentPhotoImg1_name: '23.png',
      agentPhotoImg2: this.agentIdCardPhoto[1].blob,
      agentPhotoImg2_name: '24.png',

      agentSignPhotoImg: this.agentSignPhoto[0].blob,
      agentSignPhotoImg_name: '25.png',
    };
    if (this.segmentType == '1') {//人工报价
        param.drivingLicenseImg = this.drivingLicensesPhoto[0].blob;
        param.drivingLicenseImg_name = '2.png';
    } else {//新车报价
        param.carInvoicePhotoImg = this.invoicePhoto[0].blob;
        param.carInvoicePhotoImg_name = '3.png';
    }
    // console.log(param);
    this.navCtrl.push(RequotationPage, param);
  }

}
