import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { carTypePage } from '../car-type/car-type';
import { ProvincesPage } from '../../../other/provinces/provinces';
import { CsModal } from '../../../../providers/cs-modal';
import { WebSites } from '../../../../providers/web-sites';
import { carConductPage } from '../car-conduct/car-conduct';
import { CsbzNave } from '../../../../providers/csbz-nave';
@Component({
  selector: 'page-new-car-edit',
  templateUrl: 'new-car-edit.html',
})
export class newCarEditPage {
  width: string
  selectCar: any = {};
  imageUrl = [];
  imageData = [];
  imageResult = [];
  isInist: boolean = false;
  public isNewCustomer: boolean = true;
  postCar = {
    auto: {
      autoId: '', plateNumber: "", autotypeName: "", automodelName: "",
      automakeName: "", vinCode: "", engineNo: "", createMileage: '',
      currentMileage: '', biEdate: "", auditDate: "", autoImg: []
    },
    memberName: '',
    memberSex: 1,
    memberTypeId: 0,
    memo: '',
    mobileNumber: '',
  }
  carInfo = { plateNumber: '', provinces: '', autoType: "请选择车型" };
  gender;
  public flag = false;
  callback: any;
  public title = '点击完善更多信息';
  customerType: number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public csModal: CsModal, public websites: WebSites, public toastCtrl: ToastController, public csbzNave: CsbzNave, public alertCtrl: AlertController, public changeDetectorRef: ChangeDetectorRef) {
    if (this.navParams.get('customerType')) {
      this.customerType = this.navParams.get('customerType');
    }
  }
  ngAfterViewChecked() {
    this.width = 58 + 'px';
  }
  ionViewDidLoad() {
    switch (this.customerType) {
      case 1://无牌

        this.carInfo.plateNumber = '无牌';
        if (this.navParams.get('carNum')) {
          let keyWords = this.navParams.get('carNum');
          if (this.csbzNave.checkTelephone(keyWords)) {
            this.postCar.mobileNumber = keyWords;
          }
        }
        break;
      case 2://新客户
        if (this.navParams.get('carNum')) {
          let keyWords = this.navParams.get('carNum');
          if (this.csbzNave.checkCarNo(keyWords)) {
            this.carInfo.plateNumber = keyWords.substr(1);
            this.carInfo.provinces = keyWords.substr(0, 1);
          } else if (this.csbzNave.checkTelephone(keyWords)) {
            this.postCar.mobileNumber = keyWords;
          }
        }
        break;
    }
  }
  showProvince() {
    this.csModal.showProvince(ProvincesPage,{}, (data) => {
      if (data == '无牌') {
        this.carInfo.plateNumber = '无牌';
        this.carInfo.provinces = '';
      } else if (data == "其他") {
        this.carInfo.plateNumber = '';
        this.carInfo.provinces = '';
      } else {
        this.carInfo.plateNumber = '';
        this.carInfo.provinces = data;
      }
    });
  }
  selectCarType() {
    let $this = this;
    let demo = function (data) {
      return new Promise((resolve, reject) => {
        $this.carInfo.autoType = data.automake.automakeName ? data.automake.automakeName : '请选择车型';
        $this.carInfo.autoType = $this.carInfo.autoType + ' ' + (data.hasOwnProperty('automodel') ? data.automodel.automodelName : '');
        $this.carInfo.autoType = $this.carInfo.autoType + ' ' + (data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '');
        $this.postCar.auto.automakeName = data.automake.automakeName;
        $this.postCar.auto['automakeId'] = data.automake.automakeId;
        $this.postCar.auto.automodelName = data.hasOwnProperty('automodel') ? data.automodel.automodelName : '';
        $this.postCar.auto['automodelId'] = data.hasOwnProperty('automodel') ? data.automodel.automodelId : '';
        $this.postCar.auto.autotypeName = data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '';
        $this.postCar.auto['autotypeId'] = data.hasOwnProperty('autotype') ? data.autotype.autotypeId : '';
        resolve();
      })
    }
    this.navCtrl.push(carTypePage, {
      callback: demo
    });
  }
  combinationCarType(data) {
    this.carInfo.autoType = data.automakeName ? data.automakeName : '请选择车型';
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['automodelName'] ? data.automodelName : '');
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['autotypeName'] ? data.autotypeName : '');
  }

  postEdit() {
    if (!this.postCar.mobileNumber && !this.postCar.memberName) {
      this.presentToast('请填写客户电话或者客户名称');
      return;
    }
    let CarNo = this.csbzNave.checkCarNo(this.carInfo.provinces + this.carInfo.plateNumber);
    if (!CarNo) {
      this.presentToast('请输入正确的车牌号，如粤A88888');
      return;
    }
    if (this.postCar.mobileNumber) {
      if (!this.csbzNave.checkTelephone(this.postCar.mobileNumber)) {
        this.presentToast('请输入正确的手机号码');
        return;
      }
    }
    if (this.isInist) {
      this.presentAlert('电话号码' + this.postCar.mobileNumber + "已存在");
      return;
    }
    this.postCar.auto.plateNumber = this.carInfo.provinces + this.carInfo.plateNumber.toLocaleUpperCase();
    if (this.imageData.length > 0) {
      this.websites.qiniuUpload(this.imageData).subscribe(result => {
        result.forEach((element, index) => {
          this.postCar.auto.autoImg.push({ imgUrl: element.key, sortNo: index })
        });
        this.websites.httpPost('saveMember', this.postCar).subscribe(res => {
          if (res) {
            this.navCtrl.push(carConductPage, { res: res, carNum: this.postCar.auto.plateNumber });
          }
        }, error => {
          console.log(error);
        })
      })
    } else {
      this.websites.httpPost('saveMember', this.postCar).subscribe(res => {
        if (res) {
          this.navCtrl.push(carConductPage, { res: res, carNum: this.postCar.auto.plateNumber });
        }
      }, error => {
        console.log(error);

      })

    }


  }


  moreEdit() {

    
    if (this.flag) {
      this.flag = false;
      this.title = '点击完善更多信息';
    } else {
      this.flag = true;
      this.title = "点击收起";
    }
    this.changeDetectorRef.detectChanges();
  }
  changeSex() {
    if (this.gender == 'f') {
      this.postCar.memberSex = 1;
    } else if (this.gender == 'm') {
      this.postCar.memberSex = 0;
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }
  changeMobileNumber() {

    if (this.csbzNave.checkTelephone(this.postCar.mobileNumber)) {
      let params = { mobileNumber: this.postCar.mobileNumber };
      this.websites.httpPost('getMemberDetailedByTel', params).subscribe(res => {
        if (res) {
          this.presentAlert('电话号码' + this.postCar.mobileNumber + "已存在");
        }
      })
    } else {
      this.isInist = false;
    }
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '确定',
          handler: () => {

            this.isInist = true;
          }

        },
      ]
    });
    alert.present();
  }
  scanner() {
    this.csbzNave.carIdSacn(id => {
      this.carInfo.provinces = id.substr(0, 1);
      this.carInfo.plateNumber = id.substr(1);
    })
  }
  changePlateNumber() {
    let plateNumber = this.carInfo.provinces + this.carInfo.plateNumber.toLocaleUpperCase()
    if (this.csbzNave.checkCarNo(plateNumber)) {
      let params = { plateNumber: plateNumber }
      this.websites.httpPost('getMemberDetailedByPlateNumber', params).subscribe(res => {
        if (res) {
          this.alert("车牌号" + plateNumber + "已存在，是否用该车牌号接车？", res, plateNumber);
        }
      })
    }
  }
  alert(msg, info, plateNumber) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            this.carInfo.plateNumber = "";
          }
        },
        {
          text: '确定',
          handler: () => {
            this.navCtrl.push(carConductPage, { res: info, carNum: plateNumber });
            this.carInfo.plateNumber = "";
          }
        }
      ]
    });
    alert.present();
  }
  getPicture() {
    this.csbzNave.selecPicture((data) => {
      if (!data.msg) {
        this.imageUrl.unshift({ url: data.imageSrc, imgId: "" });
        this.imageData.push(data.imageBlob);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  delectP(i) {
    this.imageUrl.splice(i, 1);
    this.imageData.splice(i, 1);
    this.changeDetectorRef.detectChanges();
  }
}

