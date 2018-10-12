import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController, AlertController } from 'ionic-angular';

import { carEditPage } from '../car-edit/car-edit';
import { orderEditPage } from '../order-edit/order-edit';
import { CsModal } from '../../../../providers/cs-modal';
import { ProvincesPage } from '../../../other/provinces/provinces';
import { carTypePage } from '../car-type/car-type';
import { AgentPopoverComponent } from '../../../other/agent-popover/agent-popover';
import { WebSites } from '../../../../providers/web-sites'
import { resourcesStaticProvider } from '../../../../providers/resources-static';
import { MergePopoverComponent } from '../../../other/merge-popover/merge-popover';
import { PayRecordlPage } from '../../../order/pay-record/pay-record';
import { toastProjectPopoverComponent } from '../../../other/toast-project-popover/toast-project-popover';
import { memoRecordPage } from './memo-record/memo-record';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { OrderDetailPage } from '../../../order/order-detail/order-detail';
import { UserData } from '../../../../providers/user-data';
declare let cordova: any;


@Component({
  selector: 'page-order-item',
  templateUrl: 'order-item.html',
})
export class orderItemPage {
  isNave: boolean = false;
  test: boolean = true;
  hasNum = 0;
  lastNum;

  public isNewCustomer: boolean = true;
  public isNewCar: boolean = true;
  public isNullmobileNumber: boolean = true;
  amountUnpaid;
  customerType: number;

  customer = { memberId: '', memberName: '', mobileNumber: '', autoId: "", plateNumber: "" };
  selectCar = {};
  pickupMileage: string = "";
  carInfo = { plateNB: '', provinces: '', autoType: "请选择车型", autoId: "" };
  priceInfo = { totalNum: 0, totalPrice: 0, servicePrice: 0, projePrice: 0, discountAmount: 0 };
  selectServcie = [];

  sendInfor = { sendUname: "", sendMobile: "" };

  qryInfo: any;

  public servicesList: any;
  public mcardServices: any = [];
  public addServices: any = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public csModal: CsModal,
    public popoverCtrl: PopoverController,
    public Websites: WebSites,
    public toastCtrl: ToastController,
    public servicsData: resourcesStaticProvider,
    private alertCtrl: AlertController,
    private csbzNave: CsbzNave,
    public RSData: resourcesStaticProvider,
    public userData: UserData) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);

    this.customer.memberId = this.navParams.get("memberId");
    this.customer.autoId = this.navParams.get("autoId");


    if (this.customer.memberId && this.customer.autoId) {
      this.customerType = 4;
    }

    if (this.customer.memberId && this.navParams.get("orderId")) {
      this.customerType = 5;
    }

    if (this.navParams.get('customerType')) {
      this.customerType = this.navParams.get('customerType');
    }
  }

  ionViewDidLoad() {
    switch (this.customerType) {
      case 1://无牌
        this.isNewCustomer = true;
        this.carInfo.plateNB = '无牌';
        this.findService();
        if (this.navParams.get('carNum')) {
          let keyWords = this.navParams.get('carNum');
          if (this.csbzNave.checkTelephone(keyWords)) {
            this.customer.mobileNumber = keyWords;
          }
        }
        break;
      case 2://新客户
        this.isNewCustomer = true;
        this.findService();
        if (this.navParams.get('carNum')) {
          let keyWords = this.navParams.get('carNum');
          if (this.csbzNave.checkCarNo(keyWords)) {
            this.carInfo.plateNB = keyWords.substr(1);
            this.carInfo.provinces = keyWords.substr(0, 1);
          } else if (this.csbzNave.checkTelephone(keyWords)) {
            this.customer.mobileNumber = keyWords;
            this.findStoreExt();
          } else {
            this.findStoreExt();
          }
        }
        break;
      case 3://老客户
        this.isNewCustomer = false;
        this.findStoreExt();
        this.customer = this.navParams.get('customer') || { memberId: '0' };
        this.findService(this.customer.memberId);
        this.findmember(this.customer.memberId);
        break;
      case 4:
        this.isNewCustomer = false;
        this.findStoreExt();
        this.findService(this.customer.memberId);
        this.findmember(this.customer.memberId);
        break;
      case 5:
        this.isNewCustomer = false;
        this.findStoreExt();
        this.getBookOrder()
        break;
    }
  }

  getRecord(autoId) {
    this.Websites.httpPost('findOrderInfoByAutoId', { autoId: autoId }, false).subscribe(res => {
      if (res) {
        if (res.count4Completed) {
          if (res.count4Completed.length > 0) {
            this.hasNum = res.count4Completed.length;
            this.lastNum = res.count4Completed[0].settlementTime;
          }
        }
        if (res.hasOwnProperty('count4Working') && res.count4Working.length > 0) {
          let popover = this.popoverCtrl.create(toastProjectPopoverComponent, { msg: "当前已有车牌”" + this.customer.plateNumber + "“进行中的订单，请确认操作？" }, { cssClass: "addProjectPopover" });
          popover.onDidDismiss(data => {
            if (data) {
              //location.href = WebConfig.server_ + '/czbbb/order/orderDetailViewNew.jsp?orderId=' + res.count4Working[0].orderId;
              this.navCtrl.push(OrderDetailPage, { orderId: res.count4Working[0].orderId });
            }
          });
          popover.present();
        }
      }
    })
  } true
  //获取接车信息
  findService(memberId?, callback?) {
    this.servicsData.loadService(memberId, true).then(res => {

      if (res['mcardServices']) this.mcardServices = res['mcardServices'];
      if (res['services']) this.servicesList = res['services'];
      if (callback) callback("ssss");
    })
  }

  //获取客户信息
  findmember(memberId, callback?) {
    let params = { memberId: memberId, auto: true }
    this.Websites.httpPost('findmember', params, false).subscribe(res => {
      res.autoId = this.customer.autoId;
      this.amountUnpaid = res.suspendedMoney.amountUnpaid;
      if (res.hasOwnProperty('autos') && res.autos.length >= 0) {
        res.autos.forEach(a => {
          if (a.autoId == this.customer.autoId || a.plateNumber == this.customer.plateNumber) {
            this.combinationCarType(a);
            a.test = this.test = !this.test;
            this.selectCar = a;
            res.plateNumber = a.plateNumber;
          }
        });
        res.autos.push({ plateNumber: '新车' });
        this.isNewCar = false;
      }
      this.customer = res;

      this.getRecord(this.customer.autoId);

      if (typeof this.customer.mobileNumber == "string" && this.customer.mobileNumber.length > 0) this.isNullmobileNumber = false;

      if (callback) callback("ssss");
    })
  }


  //获取默认省份
  findStoreExt() {
    this.Websites.httpPost('findStoreExt', {}, false).subscribe(res => {
      this.carInfo.provinces = res.defCtiyPrefix;
    })
  }

  getBookOrder() {
    this.Websites.httpPost('getBookOrder', { orderId: this.navParams.get("orderId") }, false).subscribe(res => {
      this.findService(this.customer.memberId, () => {

        var allServices = this.mcardServices.concat(this.servicesList)

        let bookS = {};

        allServices.forEach(s => {
          s.childtypeList.forEach(sc => {
            res.services.forEach(rs => {
              if (rs.serviceId == sc.serviceId && !bookS[rs.serviceId]) {
                // sc.select = true;
                bookS[rs.serviceId] = true;
                this.selectItem(sc);
              }
            });
          });
        });
      });
      this.findmember(this.customer.memberId, () => {
        if (this.customer.hasOwnProperty('autos') && this.customer["autos"].length >= 0) {
          this.customer["autos"].forEach(a => {
            if (a.plateNumber == res.plateNumber) {
              this.combinationCarType(a);
              a.test = this.test = !this.test;
              this.selectCar = a;
              this.customer.plateNumber = res.plateNumber;
            }
          });
        }
      });
    })
  }

  InsuranceQryInfo(licenseNo) {
    this.RSData.cxCode().then((msg) => {
      if (licenseNo) {
        this.Websites.httpPost('InsuranceQryInfo', { licenseNo: licenseNo }, false).subscribe(res => {
          this.qryInfo = res;
        })
      } else {
        this.qryInfo = null;
      }
    }, (msg) => { });
  }

  //编辑车辆信息
  toCarEdit() {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.findmember($this.customer.memberId);
        resolve();
      })
    }


    this.navCtrl.push(carEditPage, { carInfo: this.customer, callback: callback });
  }

  //选择项目
  selectItem(i) {
    i.select = !i.select;
    i.servicePrice = i.servicePrice || 0;
    i.goodsPrice = i.goodsPrice || 0;
    i.serviceNum = i.serviceNum || 1;
    i.goodsNum = i.goodsNum || 1;
    i.serviceCoefficient = i.serviceCoefficient || 100;
    i.goodsCoefficient = i.goodsCoefficient || 100;

    if (i.select) {
      this.priceInfo.totalNum++;
      this.priceInfo.servicePrice += i.servicePrice * i.serviceNum * i.goodsCoefficient / 100;
      this.priceInfo.projePrice += i.goodsPrice * i.goodsNum * i.serviceCoefficient / 100;

      this.selectServcie.push(i);
    } else {
      this.priceInfo.totalNum--;
      this.priceInfo.servicePrice -= i.servicePrice * i.serviceNum * i.goodsCoefficient / 100;
      this.priceInfo.projePrice -= i.goodsPrice * i.goodsNum * i.serviceCoefficient / 100;
    }

    this.priceInfo.totalPrice = this.priceInfo.servicePrice + this.priceInfo.projePrice;
  }
  //选择车辆
  changeCarID(auto) {
    if (auto.plateNumber == '新车') {
      this.isNewCar = true;
      this.combinationCarType({});
      this.selectCar = auto;
    } else {
      this.isNewCar = false;
      this.combinationCarType(auto);
      this.selectCar = auto;
      this.customer.plateNumber = auto.plateNumber;
      this.customer.autoId = auto.autoId;
    }
  }
  changePlateNumber() {
    let plateNumber = this.carInfo.provinces + this.carInfo.plateNB
    if (this.csbzNave.checkCarNo(plateNumber)) {
      let params = { plateNumber: plateNumber }
      this.Websites.httpPost('getMemberDetailedByPlateNumber', params, false).subscribe(res => {

        if (res) {
          if (this.isNewCustomer) {
            this.presentAlert("车牌号" + plateNumber + "已存在，是否用该车牌号接车？", res, 'plateNumber');
          } else {
            this.presentAlert("车牌号" + plateNumber + "已存在，是否转移车辆？", res, 'plateNumber');
          }
        }
      })
    }
  }
  changeMobileNumber() {
    if (this.csbzNave.checkTelephone(this.customer.mobileNumber)) {
      let params = { mobileNumber: this.customer.mobileNumber };
      this.Websites.httpPost('getMemberDetailedByTel', params, false).subscribe(res => {
        if (res) {
          let isUsed = "";
          if (res.hasOwnProperty('isUsed')) {
            isUsed = res.isUsed == "1" ? "有效" : "失效";
          }
          if (this.isNewCustomer) {
            this.presentAlert('电话号码' + this.customer.mobileNumber + "已存在，是否使用该客户？！客户状态（" + isUsed + ")", res, "mobileNumber");
          } else {
            this.presentAlert('电话号码' + this.customer.mobileNumber + "已存在，是否合并？！", res, "mobileNumber");
          }
        }

      })
    }
  }


  mobileNumberBlurInput() {
    if (this.customer.mobileNumber.length > 0) {
      if (!this.csbzNave.checkTelephone(this.customer.mobileNumber)) {
        this.presentOtherAlert("请输入正确的手机号码");
      }
    }
  }


  //选省份
  showProvince() {
    this.csModal.showProvince(ProvincesPage, (data) => {
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
  //选车型
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

    if (this.isNewCar) {
      this.navCtrl.push(carTypePage, {
        callback: demo
      });
    }

  }

  combinationCarType(data) {
    this.carInfo.autoType = data['automakeName'] ? data.automakeName : '请选择车型';
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['automodelName'] ? data.automodelName : '');
    this.carInfo.autoType = this.carInfo.autoType + ' ' + (data['autotypeName'] ? data.autotypeName : '');
    this.InsuranceQryInfo(data.plateNumber);

  }



  //添加送修人
  presentPrompt() {
    let popover = this.popoverCtrl.create(AgentPopoverComponent, {}, { cssClass: "agentPopover" });
    popover.onDidDismiss(data => {
      if (data) this.sendInfor = data;
    });
    popover.present();
  }


  //提交
  onConfirm() {

    let CarNo = this.csbzNave.checkCarNo(this.carInfo.provinces + this.carInfo.plateNB);
    if (!CarNo && this.isNewCar) {
      this.presentToast('请输入正确的车牌号，如粤A88888');
      return;
    }

    if (typeof this.customer.mobileNumber == "string") {
      if (this.customer.mobileNumber.length > 0 && !this.csbzNave.checkTelephone(this.customer.mobileNumber)) {
        this.presentToast('请输入正确的手机号码');
        return;
      }
    }

    if (this.customerType == 1 && this.customer.memberName == '') {
      this.presentToast('请输入客户姓名');
      return;
    }


    if ((CarNo && this.isNewCar) || !this.isNewCar) {
      let allInfo = {};
      allInfo['member'] = this.customer;
      if (this.isNewCar) {
        this.carInfo['plateNumber'] = this.carInfo.provinces + this.carInfo.plateNB.toUpperCase();
        allInfo['auto'] = this.carInfo;
      } else {
        allInfo['auto'] = this.selectCar;
      }
      allInfo['pickupMileage'] = this.pickupMileage;
      allInfo['services'] = this.siftServices();
      allInfo['sendInfor'] = this.sendInfor;
      allInfo['priceInfo'] = this.priceInfo;
      allInfo['addServices'] = this.addServices;  //在这个页面定义addServices对象；


      this.navCtrl.push(orderEditPage, { allInfo: allInfo });
    } else {
      this.presentToast('请输入正确的车牌号，如粤A88888');
    }

  }


  //抽出选中的项目
  siftServices() {
    let selectService = [];


    for (var key in this.servicesList) {
      var service = this.servicesList[key];
      var servicesList = service['childtypeList']
      servicesList.forEach((s) => {
        s.select && selectService.push(s);
      })
    }

    for (var key2 in this.mcardServices) {
      var service2 = this.mcardServices[key2];
      var servicesList2 = service2['childtypeList'];
      servicesList2.forEach((s) => {
        s.select && selectService.push(s);
      })
    }
    return selectService;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  presentOtherAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: ['确定']
    });
    alert.present();
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
              this.customer.mobileNumber = "";
            }
          }
        },
        {
          text: '确定',
          handler: () => {
            if (inputType == "plateNumber") {
              if (this.isNewCustomer) {
                this.isNewCustomer = false;
                this.customer.autoId = info.autoId;
                this.findmember(info.memberId);
              } else {
                this.updateAutoMerge(info);
              }
            } else if (inputType == "mobileNumber") {
              if (this.isNewCustomer) {
                this.isNewCustomer = false;
                this.customer.autoId = info.autoId;
                this.findmember(info.memberId);
              } else {
                this.presentMergePrompt(info.memberId);
              }
            }
          }
        }
      ]
    });
    alert.present();
  }


  updateAutoMerge(info) {
    let params = { memberId: this.customer.memberId, autoId: info.autoId };
    this.Websites.httpPost('updateAutoMerge', params).subscribe(res => {
      this.customer.autoId = info.autoId;
      this.findmember(this.customer.memberId);
    })
  }


  presentMergePrompt(memberId) {
    this.Websites.httpPost('getMemberMessages', { memberId1: this.customer.memberId, memberId2: memberId }).subscribe(res => {
      if (res) {
        res.currenMemberId = this.customer.memberId;
        res.mergeMemberId = memberId;
        let popover = this.popoverCtrl.create(MergePopoverComponent, { memberInfo: res }, { cssClass: "mergePopover", enableBackdropDismiss: false });
        popover.onDidDismiss(data => {
          this.findmember(this.customer.memberId);
        });
        popover.present();
      }
    });

  }


  toPayRecord() {
    this.navCtrl.push(PayRecordlPage, { memberId: this.customer.memberId, autoId: this.customer.autoId, plateNumber: this.customer.plateNumber });
  }

  toMemoRecord() {
    this.navCtrl.push(memoRecordPage, { customer: this.customer });
  }
  close() {
    this.amountUnpaid = 0;
  }

  closewin() {
    this.csbzNave.closewin();
  }

  onCX() {
    cordova.BSTool.pushBSView({ "tokenId": this.userData.getToken(), "home": 1, "carNum": this.customer.plateNumber }, (res) => {

    }, (error) => {
      console.log(error);
    })

  }
}
