
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { CsModal } from '../../../../providers/cs-modal';
import { carTypePage } from '../../receive-car/car-type/car-type';
import { memberOpenCertainPage } from '../member-open-certain/member-open-certain';
import { ProvincesPage } from '../../../other/provinces/provinces';

@Component({
  selector: 'page-member-open',
  templateUrl: 'member-open.html',
})
export class memberOpenPage {

  @ViewChild('mobileNumber') input;

  public isNewCar: boolean = true;

  memberInfo = {
    memberName: '',
    mobileNumber: '',
    plateNumber: '',
    memberId: ""
  }
  carInfo: any = { plateNB: '', provinces: '', autotypeName: "请选择车型" };

  salecardList: any[] = [];
  selectSalecard;
  selectCar: any = {};
  img_path: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public websites: WebSites,
    private csbzNave: CsbzNave,
    private csModal: CsModal,
    private alertCtrl: AlertController, ) {
    this.img_path = WebConfig.img_path;

    let member = this.navParams.get('memberInfo');
    if (member && member.memberId) {
      this.isNewCar = false;
      this.findmember(member);
    }
  }

  ionViewDidLoad() {
    this.findmcardtmpls4salecard();
    this.findStoreExt();
  }

  findStoreExt() {
    this.websites.httpPost('findStoreExt', {}).subscribe(res => {
      this.carInfo.provinces = res.defCtiyPrefix;
    })
  }

  //获取客户信息
  findmember(member) {
    let params = { memberId: member.memberId, auto: true }
    this.websites.httpPost('findmember', params).subscribe(res => {
      res.autoId = member.autoId;
      if (res.hasOwnProperty('autos') && res.autos.length >= 0) {
        res.autos.forEach(a => {
          if (a.autoId == member.autoId) {
            this.selectCar = a;
            res.plateNumber = a.plateNumber;
          }
        });
        if (!this.selectCar) {
          this.selectCar = res.autos[0]
        }
        res.autos.push({ plateNumber: '新车' });
      }

      this.memberInfo = res;
    })
  }


  //获取卡模板列表
  findmcardtmpls4salecard() {
    this.websites.httpPost('findmcardtmpls4salecard', {},true).subscribe(res => {
      this.salecardList = res;
    })
  }



  plateNumberChange() {
    if (this.selectCar.plateNumber == "新车") {
      this.isNewCar = true;
    } else {
      this.isNewCar = false;
    }
  }

  selectCarType() {
    let $this = this;
    let demo = function (data) {
      return new Promise((resolve, reject) => {
        if (data.hasOwnProperty('automake')) {
          $this.carInfo.autoType = data.automake.automakeName;
          $this.carInfo['automakeName'] = data.automake.automakeName;
          $this.carInfo['automakeId'] = data.automake.automakeId;
        } else {
          $this.carInfo.autoType = '请选择车型';
        }

        if (data.hasOwnProperty('automodel')) {
          $this.carInfo.autoType = $this.carInfo.autoType + data.automodel.automodelName;
          $this.carInfo['automodelName'] = data.automodel.automodelName;
          $this.carInfo['automodelId'] = data.automodel.automodelId;
        }

        if (data.hasOwnProperty('autotype')) {
          $this.carInfo.autoType = $this.carInfo.autoType + data.autotype.autotypeName;
          $this.carInfo['autotypeId'] = data.autotype.autotypeId;
        }
        resolve();
      })
    }

    this.navCtrl.push(carTypePage, {
      callback: demo
    });

  }

  //选省份
  showProvince() {
    this.csModal.showProvince(ProvincesPage,{},1, (data) => {
      if (data == '无牌') {
        this.carInfo.plateNB = '无牌';
        this.carInfo.provinces = '';
      } else if (data == "其他") {
        this.carInfo.plateNB = '';
        this.carInfo.provinces = '';
      } else {
        this.carInfo.plateNB = '';
        this.carInfo.provinces = data;
      }
    });
  }

  certain() {
    this.memberInfo.mobileNumber = this.memberInfo.mobileNumber ? this.memberInfo.mobileNumber : "";
    if (this.memberInfo.mobileNumber.toString().length == 0) {
      this.csModal.showAlert('你未输入手机号码，将无法对该车主进行营销', (() => {
        this.input.nativeElement.focus();
      }), (() => {
        this.pushOpenCertain();
      }), '返回输入', '继续开卡')
    } else {
      this.pushOpenCertain();
    }
  }

  changePlateNumber() {
    let plateNumber = this.carInfo.provinces + this.carInfo.plateNB
    if (this.csbzNave.checkCarNo(plateNumber)) {
      let params = { plateNumber: plateNumber }
      this.websites.httpPost('getMemberDetailedByPlateNumber', params).subscribe(res => {

        if (res) {

          this.presentAlert("车牌号" + plateNumber + "已存在，是否用该车牌号开卡？", res, 'plateNumber');

        }
      })
    }
  }

  changeMobileNumber() {
    if (this.csbzNave.checkTelephone(this.memberInfo.mobileNumber)) {
      let params = { mobileNumber: this.memberInfo.mobileNumber };
      this.websites.httpPost('getMemberDetailedByTel', params).subscribe(res => {
        if (res) {
          let isUsed = "";
          if (res.hasOwnProperty('isUsed')) {
            isUsed = res.isUsed == "1" ? "有效" : "失效";
          }

          this.presentAlert('电话号码' + this.memberInfo.mobileNumber + "已存在，是否使用该客户？！客户状态（" + isUsed + ")", res, "mobileNumber");
        }

      })
    }
  }

  presentAlert(msg, info, inputType) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            if (inputType == "plateNumber") {
              this.carInfo.plateNB = "";
            } else if (inputType == "mobileNumber") {
              this.memberInfo.mobileNumber = "";
            }
          }
        },
        {
          text: '确定',
          handler: () => {
            if (inputType == "plateNumber") {
              this.findmember(info);

            } else if (inputType == "mobileNumber") {
              this.findmember(info);
            }

            this.isNewCar = false;
          }
        }
      ]
    });
    alert.present();
  }

  pushOpenCertain() {
    if (!this.csbzNave.checkTelephone(this.memberInfo.mobileNumber)) {
      this.csModal.showToast("请输入正确的手机号码");
      return;
    }

    if (this.memberInfo.memberName.length == 0) {
      this.csModal.showToast("请输入用户姓名");
      return;
    }

    if (!this.csbzNave.checkCarNo(this.carInfo.provinces + this.carInfo.plateNB) && this.isNewCar) {
      this.csModal.showToast("请输入正确的车牌号");
      return;
    }

    if (!this.selectSalecard) {
      this.csModal.showToast("请选择开立的会员卡");
      return;
    }

    let carP = {};
    if (this.isNewCar) {
      this.carInfo.plateNumber = this.carInfo.provinces + this.carInfo.plateNB.toUpperCase();
      carP = this.carInfo;
    } else {
      carP = this.selectCar;
    }

    this.navCtrl.push(memberOpenCertainPage, { memberInfo: this.memberInfo, salecard: this.selectSalecard, carInfo: carP });
  }


}

