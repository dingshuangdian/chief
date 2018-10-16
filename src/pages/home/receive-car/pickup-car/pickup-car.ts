import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController, Content } from 'ionic-angular';
import { EditPlatnumPopoverPage } from '../../../other/edit-platnum-popover/edit-platnum-popover';
import { CarownerPopoverPage } from '../../../other/carowner-popover/carowner-popover';
import { carTypePage } from '../car-type/car-type';
import { memberRechargePage } from '../../member-mng/member-recharge/member-recharge';
import { orderItemPage } from '../../receive-car/order-item/order-item';
import { carEditPage } from '../../receive-car/car-edit/car-edit';
import { washCarPage } from '../wash-car/wash-car';
import { carConductPage } from '../car-conduct/car-conduct';
import { newCustomPage } from '../../custom/new-custom/new-custom';
import { OrderDetailPage } from '../../../order/order-detail/order-detail';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from "../../../../providers/web-config";
import { CsbzNave } from '../../../../providers/csbz-nave';
declare let cordova: any;

/**
 * Generated class for the pickupCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pickup-car',
  templateUrl: 'pickup-car.html',
})
export class pickupCarPage {

  @ViewChild(Content) content: Content;

  img_path = WebConfig.img_path;
  press: boolean = false;
  isFlag: boolean = true;//true--新车 false--有信息
  lmoreFlag: boolean = true;//true--完善更多信息 false--收起更多信息
  mCardFlag: boolean = false;//会员卡隐藏显示 true--显示全部 false--显示部分
  orderFlag: boolean = false;//消费记录隐藏显示 true--显示全部 false--显示部分
  noResultFlag: boolean = false;//扫描车牌结果
  isInist: boolean = false;//数据库是否有此电话号码
  imageUrl: any = [];//本地选择的图片
  imageData: any = [];
  dataArr: any;//老客户结果数组
  plateNumber: string = '';//车牌
  olduserInfos: any = {};
  // olduserInfos: any = {//老客户当前显示的一个对象数据
  //   'auditDate': '',
  //   'autoId': '',
  //   'autoimgs': '',
  //   'automakeName': '',
  //   'automodelName': '',
  //   'autotypeName': '',
  //   'biEdate': '',
  //   'createMileage': '',
  //   'currentMileage': '',
  //   'engineNo': '',
  //   'insuranceInfo': '',
  //   'mcard': {
  //     'mcardNum': '',
  //     'totalbalance': '',
  //     'mcards': []
  //   },
  //   'memberId': '',
  //   'memberName': '',
  //   'memberSex': '',
  //   'memo': '',
  //   'mobileNumber': '',
  //   'order': '',
  //   'plateNumber': '',
  //   'vinCode': '',
  // };
  newuserInfos: any = {//新用户数据
    "plateNumber": '',//车牌,
    "automakeName": '',//"品牌名称",
    "automodelName": '',//"车系名称",
    "autotypeName": '',//"车型名称",
    "autotypeId": '',//"车型ID",
    "automodelId": '',//"车系ID",
    "automakeId": '',//"品牌ID",
    "vinCode": '',//车架号,
    "engineNo": '',//发动机号,
    "createMileage": '',//首次进厂里程,
    "currentMileage": '',//最近保养号,
    "biEdate": '',//保险日期,
    "auditDate": '',//年审月份,
    "autoImg": [],//图片
    'imageData': [],
    'memberName': '',//客户名称
    'memberSex': '',//客户性别
    'memberTypeId': '',//客户类型
    'memo': '',//客户备注
    'mobileNumber': '',//手机号码
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public websites: WebSites,
    public csbzNave: CsbzNave,
    public changeDetectorRef: ChangeDetectorRef,
    public alertCtrl: AlertController,
  ) {
    var id = this.navParams.get('id');
    this.reqPlateNumer(id, true);
  }
  //修改车牌
  EditPlatnum() {
    let popover = this.popoverCtrl.create(EditPlatnumPopoverPage, {
      'plateNumber': this.plateNumber,
    }, {
        cssClass: "editPlatnumPopover",
      });
    popover.onDidDismiss(data => {
      if (data) {
        this.reqPlateNumer(data, true);
      }
    });
    popover.present();
  }

  //校验手机号码
  changeMobileNumber() {
    if (this.csbzNave.checkTelephone(this.newuserInfos.mobileNumber)) {
      let params = { mobileNumber: this.newuserInfos.mobileNumber };
      this.websites.httpPost('getMemberDetailedByTel', params, false).subscribe(res => {
        if (res) {
          this.presentAlert('电话号码' + this.newuserInfos.mobileNumber + "已存在");
        }
      })
    } else {
      this.isInist = false;
    }
  }

  //车主信息
  carOwnerMsgPop() {
    var _self = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        _self.reqPlateNumer(_self.plateNumber, false);
        resolve();
      })
    }
    var consumer = {
      'memo': _self.olduserInfos.memo,
      'mobileNumber': _self.olduserInfos.mobileNumber,
      'memberSex': _self.olduserInfos.memberSex,
      'memberName': _self.olduserInfos.memberName,
      'memberId': _self.olduserInfos.memberId,
      'memberTypeId': 0,
    }
    _self.navCtrl.push(newCustomPage, { consumer: consumer, callback: callback });
  }

  //车型
  toCarEdit() {
    let _self = this;
    let demo = function (data) {
      return new Promise((resolve, reject) => {
        if (_self.isFlag) {
          _self.newuserInfos.autoType = data.automake.automakeName ? data.automake.automakeName : '请选择车型';
          _self.newuserInfos.autoType = _self.newuserInfos.autoType + ' ' + (data.hasOwnProperty('automodel') ? data.automodel.automodelName : '');
          _self.newuserInfos.autoType = _self.newuserInfos.autoType + ' ' + (data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '');
          _self.newuserInfos.automakeName = data.automake.automakeName;
          _self.newuserInfos['automakeId'] = data.automake.automakeId;
          _self.newuserInfos.automodelName = data.hasOwnProperty('automodel') ? data.automodel.automodelName : '';
          _self.newuserInfos['automodelId'] = data.hasOwnProperty('automodel') ? data.automodel.automodelId : '';
          _self.newuserInfos.autotypeName = data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '';
          _self.newuserInfos['autotypeId'] = data.hasOwnProperty('autotype') ? data.autotype.autotypeId : '';
        } else {
          _self.olduserInfos.autoType = data.automake.automakeName ? data.automake.automakeName : '请选择车型';
          _self.olduserInfos.autoType = _self.olduserInfos.autoType + ' ' + (data.hasOwnProperty('automodel') ? data.automodel.automodelName : '');
          _self.olduserInfos.autoType = _self.olduserInfos.autoType + ' ' + (data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '');
          _self.olduserInfos.automakeName = data.automake.automakeName;
          _self.olduserInfos['automakeId'] = data.automake.automakeId;
          _self.olduserInfos.automodelName = data.hasOwnProperty('automodel') ? data.automodel.automodelName : '';
          _self.olduserInfos['automodelId'] = data.hasOwnProperty('automodel') ? data.automodel.automodelId : '';
          _self.olduserInfos.autotypeName = data.hasOwnProperty('autotype') ? data.autotype.autotypeName : '';
          _self.olduserInfos['autotypeId'] = data.hasOwnProperty('autotype') ? data.autotype.autotypeId : '';
        }
        resolve();
      })
    }
    this.navCtrl.push(carTypePage, {
      callback: demo
    });
  }

  //查看消费详情
  goConsumerMsg(orderId) {
    this.navCtrl.push(OrderDetailPage, {
      'orderId': orderId
    });
  }

  //充值
  topUp(mcardInfo) {
    this.navCtrl.push(memberRechargePage, { memberInfo: mcardInfo });
  }

  //车辆编辑
  goEditCar() {
    var _self = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        _self.reqPlateNumer(_self.plateNumber, false);
        resolve();
      })
    }
    var carInfo = {
      plateNumber: this.plateNumber,
      currentMileage: this.olduserInfos.currentMileage,
      createMileage: this.olduserInfos.createMileage,
      vinCode: this.olduserInfos.vinCode,
      engineNo: this.olduserInfos.engineNo,
      auditDate: this.olduserInfos.auditDate,
      autoId: this.olduserInfos.autoId,
      automakeName: this.olduserInfos.automakeName,
      automodelName: this.olduserInfos.automodelName,
      autotypeName: this.olduserInfos.autotypeName,
      autoImg: this.olduserInfos.autoimgs,
      biEdate: this.olduserInfos.biEdate,
    }
    this.navCtrl.push(carEditPage, { carInfo: carInfo, memberId: this.olduserInfos.memberId, callback: callback });
  }

  //洗车
  goWashCar() {
    var customer = {
      memberId: this.olduserInfos.memberId,
      memberName: this.olduserInfos.memberName,
      memberSex: this.olduserInfos.memberSex,
      mobileNumber: this.olduserInfos.mobileNumber,
      plateNumber: this.plateNumber,
      autoId: this.olduserInfos.autoId,
    }
    this.navCtrl.push(washCarPage, {
      customer: customer,
      customerType: 3
    });
  }
  //接车
  goRecivedCar() {
    var carInfo = {
      plateNumber: this.plateNumber,
      mobileNumber: this.olduserInfos.mobileNumber,
      memberId: this.olduserInfos.memberId,
      memberName: this.olduserInfos.memberName,
      currentMileage: this.olduserInfos.currentMileage,
      createMileage: this.olduserInfos.createMileage,
      vinCode: this.olduserInfos.vinCode,
      engineNo: this.olduserInfos.engineNo,
      auditDate: this.olduserInfos.auditDate,
      autoId: this.olduserInfos.autoId,
      automakeName: this.olduserInfos.automakeName,
      automodelName: this.olduserInfos.automodelName,
      autotypeName: this.olduserInfos.autotypeName,
      autoImg: this.olduserInfos.autoimgs,
      biEdate: this.olduserInfos.biEdate,
    }
    this.navCtrl.push(orderItemPage, { customer: carInfo, customerType: 3 });
  }
  //维修
  goCarConduct() {
    var customer = {
      memberId: this.olduserInfos.memberId,
      memberName: this.olduserInfos.memberName,
      memberSex: this.olduserInfos.memberSex,
      mobileNumber: this.olduserInfos.mobileNumber,
      plateNumber: this.plateNumber,
      autoId: this.olduserInfos.autoId,
    }
    this.navCtrl.push(carConductPage, {
      customer: customer
    });
  }

  //扫描车牌
  scanner() {
    this.csbzNave.carIdSacn(id => {
      if (id) {//扫码有结果
        this.noResultFlag = false;
        this.reqPlateNumer(id, true);
      } else {//扫码无结果
        this.noResultFlag = true;
      }
    })
  }

  //进来执行请求对象车牌的信息
  reqPlateNumer(plateNumber, flag) {//flag -- true代表有多车主要显示弹窗 false--代表有多车主 也不弹窗 显示刚刚显示的车主
    var _self = this;
    _self.plateNumber = plateNumber;

    _self.websites.httpPost('findMember4plateNumber', { 'plateNumber': plateNumber }, false)
      .subscribe((data) => {
        if (data) {//有信息
          _self.isFlag = false;
          if (data.length > 1) {//多车主情况
            _self.dataArr = data;
            if (flag) {//多车主 弹窗
              let owners = [];
              for (var i = 0; i < _self.dataArr.length; i++) {
                var obj: any = {};
                obj.name = _self.dataArr[i].memberName;
                obj.mobileNumber = _self.dataArr[i].mobileNumber;
                obj.val = i;
                owners.push(obj);
              }
              var param = {
                'plateNumber': _self.plateNumber,
                'owners': owners,
              };
              let popover = _self.popoverCtrl.create(CarownerPopoverPage, param, { cssClass: "carownerPopover", enableBackdropDismiss: false, });
              popover.onDidDismiss(data => {
                if (data) {
                  _self.olduserInfos = _self.dataArr[data.val];
                  _self.changeDetectorRef.detectChanges();
                } else {
                  _self.olduserInfos = data[0];
                  _self.changeDetectorRef.detectChanges();
                }
              });
              popover.present();
            } else {//多车主 不弹窗
              for (i = 0; i < _self.dataArr.length; i++) {
                if (_self.dataArr[i].memberId == _self.olduserInfos.memberId) {
                  _self.olduserInfos = _self.dataArr[i];
                  _self.changeDetectorRef.detectChanges();
                  break;
                }
              }
            }
          } else {//一个车主
            _self.olduserInfos = data[0];
            _self.changeDetectorRef.detectChanges();
          }
        } else {//新车
          _self.isFlag = true;
          _self.resetNewInfos();
          _self.olduserInfos = {};
          _self.changeDetectorRef.detectChanges();
        }
      })
  }

  //从相机/相册中选中图片
  getPicture() {
    this.csbzNave.selecPicture((data) => {
      if (!data.msg) {//上传图片成功
        this.imageUrl.unshift({ url: data.imageSrc, imgId: "" });//imgId： 用来判断是本地的图片还是服务器的图片
        this.imageData.push(data.imageBlob);
        this.changeDetectorRef.detectChanges();
      }
    })
  }
  //删除图片
  delectP(i) {
    this.imageUrl.splice(i, 1);
    this.imageData.splice(i, 1);
    this.changeDetectorRef.detectChanges();
  }
  //查看图片
  selectPicture(index) {
    var urlString = [];
    this.imageUrl.forEach(element => {
      if (element.sortNo) {
        urlString.push({ "url": element.url });
      } else {
        let baseSrc = element.url.split(",")[1];
        urlString.push({ "src": baseSrc });
      }
    });
    if (urlString.length == 0) {
      return;
    }

    cordova.plugins.PhotoView.show({ imageArr: urlString, index: index }, (res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }

  //弹窗提示
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '确定',
          handler: () => {
            return;
          }
        },
      ]
    });
    alert.present();
  }

  //保存按钮
  saveBtn() {
    var param: any = {
      auto: {}
    };
    if (!this.newuserInfos.memberName && !this.newuserInfos.mobileNumber) {
      this.presentAlert("请至少填写客户电话或者客户名称");
      return;
    }
    let CarNo = this.csbzNave.checkCarNo(this.plateNumber);
    if (!CarNo) {
      this.presentAlert('请输入正确的车牌号，如粤A88888');
      return;
    } else {
      param.auto.plateNumber = this.plateNumber;
    }
    if (this.newuserInfos.mobileNumber) {
      if (!this.csbzNave.checkTelephone(this.newuserInfos.mobileNumber)) {
        this.presentAlert("请输入正确的手机号码");
        return;
      } else {
        if (this.isInist) {
          this.presentAlert('电话号码' + this.newuserInfos.mobileNumber + "已存在");
          return;
        } else {
          param.mobileNumber = this.newuserInfos.mobileNumber;
        }
      }
    }
    param.memberTypeId = 0;
    param.memberName = this.newuserInfos.memberName;
    param.memo = this.newuserInfos.memo;
    param.memberSex = this.newuserInfos.memberSex;
    param.auto.vinCode = this.newuserInfos.vinCode;
    param.auto.engineNo = this.newuserInfos.engineNo;
    param.auto.createMileage = this.newuserInfos.createMileage;
    param.auto.currentMileage = this.newuserInfos.currentMileage;
    param.auto.biEdate = this.newuserInfos.biEdate;
    param.auto.auditDate = this.newuserInfos.auditDate;
    param.auto.automakeName = this.newuserInfos.automakeName;
    param.auto.automodelName = this.newuserInfos.automodelName;
    param.auto.autotypeName = this.newuserInfos.autotypeName;
    param.auto.autotypeId = this.newuserInfos.autotypeId;
    param.auto.automodelId = this.newuserInfos.automodelId;
    param.auto.automakeId = this.newuserInfos.automakeId;
    if (this.imageData.length > 0) {
      this.websites.qiniuUpload(this.imageData).subscribe(result => {
        result.forEach((element, index) => {
          this.newuserInfos.autoImg.push({ imgUrl: element.key, sortNo: index });
        });
        param.auto.autoImg = this.newuserInfos.autoImg;
        this.saveMsg(param);
      })  
    }else{
      param.auto.autoImg = [];
      this.saveMsg(param);
    }
  }

  //保存信息  
  saveMsg(param) {
    this.websites.httpPost('saveMember', param).subscribe(res => {
      if (res) {
        this.isFlag = false;
        this.resetNewInfos();
        this.reqPlateNumer(this.plateNumber, true);
      }
    }, error => {
      // this.showToast.showToast(error.body.msg);
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

  tapChange(e) {
    this.newuserInfos.memberSex = e;
  }

  resetNewInfos() {
    this.newuserInfos = {//新用户数据
      "plateNumber": '',//车牌,
      "automakeName": '',//"品牌名称",
      "automodelName": '',//"车系名称",
      "autotypeName": '',//"车型名称",
      "autotypeId": '',//"车型ID",
      "automodelId": '',//"车系ID",
      "automakeId": '',//"品牌ID",
      "vinCode": '',//车架号,
      "engineNo": '',//发动机号,
      "createMileage": '',//首次进厂里程,
      "currentMileage": '',//最近保养号,
      "biEdate": '',//保险日期,
      "auditDate": '',//年审月份,
      "autoImg": [],//图片
      'imageData': [],
      'memberName': '',//客户名称
      'memberSex': '',//客户性别
      'memberTypeId': '',//客户类型
      'memo': '',//客户备注
      'mobileNumber': '',//手机号码
    };
    this.imageUrl = [];
    this.imageData = [];
  }

  //最近消费
  recentConsum() {
    this.orderFlag = !this.orderFlag;
    this.changeDetectorRef.detectChanges();
  }
  //会员卡
  mCard() {
    this.mCardFlag = !this.mCardFlag;
    this.changeDetectorRef.detectChanges();
  }
  //完善更多信息/收起更多信息
  lMoreFlag() {
    this.lmoreFlag = !this.lmoreFlag
    this.changeDetectorRef.detectChanges();
  }

  focusFun(){
    this.scrollTokeyboardHeight();
  }
  scrollTokeyboardHeight() {//让content向上滚动 软键盘的高度
    window.addEventListener('native.keyboardshow',(e:any) =>{
    //alert(e.keyboardHeight);
    this.content.scrollTo(0,e.keyboardHeight);
    });
  }
}
