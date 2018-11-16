import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, Events } from 'ionic-angular';
import { carTypePage } from '../car-type/car-type';
import { ProvincesPage } from '../../../other/provinces/provinces';
import { CsModal } from '../../../../providers/cs-modal';
import { WebSites } from '../../../../providers/web-sites';
import { CsbzNave } from '../../../../providers/csbz-nave';

import { WebConfig } from '../../../../providers/web-config';
declare let cordova: any;

@Component({
  selector: 'page-car-edit',
  templateUrl: 'car-edit.html',
})
export class carEditPage {
  width: string
  imageUrl = [];
  imageData = [];
  imageResult = [];
  urlString = [];
  press = false;

  selectCar: any = {};
  selectCarNum = {
    auditDate: "",
    autoId: '',
    automakeName: "",
    automodelName: "",
    autotypeName: "",
    biEdate: "",
    createMileage: 0,
    currentMileage: 0,
    engineNo: "",
    plateNumber: "",
    vinCode: "",
    memberId: '',
    autoImg: []
  };
  carInfo = { plateNumber: '', provinces: '', autoType: "请选择车型" };


  callback: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public csModal: CsModal, public websites: WebSites,
    public toastCtrl: ToastController, public csbzNave: CsbzNave,
    public changeDetectorRef: ChangeDetectorRef,
    public platform: Platform) {
    this.callback = this.navParams.get('callback');
  }
  ngAfterViewChecked() {
    this.width = 58 + 'px';
  }
  ionViewDidLoad() {
    if (this.navParams.get("carInfo")) {
      this.selectCar = this.navParams.get("carInfo");
      if (this.selectCar.autos) {
        this.selectCar.autos.forEach(element => {
          if (element.plateNumber == this.selectCar.plateNumber) {
            this.carInfo.provinces = element.plateNumber.substr(0, 1);
            this.carInfo.plateNumber = element.plateNumber.substr(1);
            this.combinationCarType(element);
            this.selectCarNum.auditDate = element.auditDate || '';
            this.selectCarNum.autoId = element.autoId || 0;
            this.selectCarNum.automakeName = element.automakeName || '';
            this.selectCarNum.automodelName = element.automodelName || '';
            this.selectCarNum.autotypeName = element.autotypeName || '';
            this.selectCarNum.biEdate = element.biEdate || '';
            this.selectCarNum.createMileage = element.createMileage || 0;
            this.selectCarNum.currentMileage = element.currentMileage || 0;
            this.selectCarNum.engineNo = element.engineNo || '';
            this.selectCarNum.plateNumber = element.plateNumber || '';
            this.selectCarNum.vinCode = element.vinCode || '';
            element.autoImg && element.autoImg.forEach(element => {
              this.imageUrl.push({ url: WebConfig.img_path.concat(element.imgUrl), imgId: element.imgId })

            });
          }
          this.selectCarNum.memberId = this.selectCar.memberId;
        });
      } else {
        this.carInfo.provinces = this.selectCar.plateNumber.substr(0, 1);
        this.carInfo.plateNumber = this.selectCar.plateNumber.substr(1);
        this.combinationCarType(this.selectCar);
        this.selectCarNum.auditDate = this.selectCar.auditDate || '';
        this.selectCarNum.autoId = this.selectCar.autoId || 0;
        this.selectCarNum.automakeName = this.selectCar.automakeName || '';
        this.selectCarNum.automodelName = this.selectCar.automodelName || '';
        this.selectCarNum.autotypeName = this.selectCar.autotypeName || '';
        this.selectCarNum.biEdate = this.selectCar.biEdate || '';
        this.selectCarNum.createMileage = this.selectCar.createMileage || 0;
        this.selectCarNum.currentMileage = this.selectCar.currentMileage || 0;
        this.selectCarNum.engineNo = this.selectCar.engineNo || '';
        this.selectCarNum.plateNumber = this.selectCar.plateNumber || '';
        this.selectCar.autoImg && this.selectCar.autoImg.forEach(element => {
          this.imageUrl.push({ url: WebConfig.img_path.concat(element.imgUrl), imgId: element.imgId })
        });

        this.selectCarNum.vinCode = this.selectCar.vinCode || '';
        this.selectCarNum.memberId = this.navParams.get("memberId");
      }
    } else {
      this.selectCarNum.memberId = this.navParams.get("memberId");
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
        $this.selectCarNum.automakeName = data.automake.automakeName;
        $this.selectCarNum['automakeId'] = data.automake.automakeId;
        $this.selectCarNum.automodelName = data.hasOwnProperty('automodel') ? data.automodel.automodelName : '';
        $this.selectCarNum['automodelId'] = data.hasOwnProperty('automodel') ? data.automodel.automodelId : '';
        $this.selectCarNum.autotypeName = data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '';
        $this.selectCarNum['autotypeId'] = data.hasOwnProperty('autotype') ? data.autotype.autotypeId : '';
        resolve();
      })
    }
    this.navCtrl.push(carTypePage, {
      callback: demo
    });
  }

  changePlateNumber() {
    let plateNumber = this.carInfo.provinces + this.carInfo.plateNumber
    if (this.csbzNave.checkCarNo(plateNumber)) {
      let params = { plateNumber: plateNumber }
      this.websites.httpPost('getMemberDetailedByPlateNumber', params, false).subscribe(res => {
        if (res) {
          this.csModal.showAlert("车牌号" + plateNumber + "已存在!", () => {
            this.carInfo.plateNumber = "";
          });
        }
      })
    }
  }

  combinationCarType(data) {
    this.carInfo.autoType = data['automakeName'] ? data.automakeName : '请选择车型';
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['automodelName'] ? data.automodelName : '');
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['autotypeName'] ? data.autotypeName : '');
  }

  postEdit() {
    let CarNo = this.csbzNave.checkCarNo(this.carInfo.provinces + this.carInfo.plateNumber);
    if (!CarNo) {
      this.presentToast('请输入正确的车牌号，如粤A88888');
      return;
    }
    this.selectCarNum.plateNumber = this.carInfo.provinces + this.carInfo.plateNumber.toLocaleUpperCase();
    if (this.imageData.length > 0) {
      this.websites.qiniuUpload(this.imageData).subscribe(result => {
        result.forEach((element, index) => {
          this.selectCarNum.autoImg.push({ imgUrl: element.key, sortNo: index })

        });
        this.websites.httpPost('saveAuto', this.selectCarNum).subscribe(res => {

          if (this.callback) {
            this.callback().then(() => {
              this.navCtrl.pop();
            })
          } else {
            this.navCtrl.pop();
          }

        })

      })
    } else {
      this.websites.httpPost('saveAuto', this.selectCarNum).subscribe(res => {

        if (this.callback) {
          this.callback().then(() => {
            this.navCtrl.pop();
          })
        } else {
          this.navCtrl.pop();
        }

      })
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
  scanner() {
    this.csbzNave.carIdSacn(id => {
      this.carInfo.provinces = id.substr(0, 1);
      this.carInfo.plateNumber = id.substr(1);
    })
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



  delectP(item, i) {
    if (item.imgId) {
      this.websites.httpPost("deleteAutoImage", { imgId: item.imgId }).subscribe(res => {
        this.imageUrl.splice(i, 1);
      })
    } else {
      this.imageUrl.splice(i, 1);
      this.imageData.splice(i, 1);
    }
    this.changeDetectorRef.detectChanges();
  }
  selectPicture(index) {
    this.urlString = [];
    this.imageUrl.forEach(element => {
      if (element.imgId) {
        this.urlString.push({ "url": element.url });
      } else {
        let baseSrc = element.url.split(",")[1];
        this.urlString.push({ "src": baseSrc });
      }
    });
    if (this.urlString.length == 0) {
      return;
    }

    cordova.plugins.PhotoView.show({ imageArr: this.urlString, index: index }, (res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }
  pressEvent(e) {
    this.press = true;
  }
  tapEvent(e) {
    if (this.press == true) {
      this.press = false;
    }
  }
}
