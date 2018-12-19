import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController, AlertController } from 'ionic-angular';

import { carEditPage } from '../car-edit/car-edit';
import { CsModal } from '../../../../providers/cs-modal';

import { ProvincesPage } from '../../../other/provinces/provinces';
import { carTypePage } from '../car-type/car-type';
import { AgentPopoverComponent } from '../../../other/agent-popover/agent-popover';

import { WebSites } from '../../../../providers/web-sites'
import { resourcesStaticProvider } from '../../../../providers/resources-static';
import { MergePopoverComponent } from '../../../other/merge-popover/merge-popover';
import { toastProjectPopoverComponent } from '../../../other/toast-project-popover/toast-project-popover';
import { WebConfig } from '../../../../providers/web-config';
import { orderPostPage } from '../order-post/order-post';
import { OrderEditSelectPage } from '../order-edit/order-edit-select/order-edit-select';
import { CsbzNave } from '../../../../providers/csbz-nave';





@Component({
  selector: 'page-wash-car',
  templateUrl: 'wash-car.html',
})
export class washCarPage {
  isNave: boolean = false;
  test: boolean = true;
  hasNum = 0;
  lastNum;

  amountUnpaid;
  public isNewCustomer: boolean = true;
  public isNewCar: boolean = true;
  public isNullmobileNumber: boolean = true;

  customerType: number;

  customer = { memberId: '', memberName: '', mobileNumber: '', autoId: "", plateNumber: "", bindUid: "" };
  selectCar = {};
  pickupMileage: string = "";
  carInfo = { plateNB: '', provinces: '', autoType: "请选择车型", autoId: "" };
  priceInfo = { totalNum: 0, totalPrice: 0, servicePrice: 0, projePrice: 0, discountAmount: 0 };
  selectServcie = [];

  sendInfor = { sendUname: "", sendMobile: "" };

  public servicesList: any;
  public mcardServices: any = [];

  technicianList = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public csModal: CsModal,
    public popoverCtrl: PopoverController,
    public Websites: WebSites,
    public toastCtrl: ToastController,
    public servicsData: resourcesStaticProvider,
    private alertCtrl: AlertController,
    private csbzNave: CsbzNave) {

    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);

    this.customer.memberId = this.navParams.get("memberId");
    this.customer.autoId = this.navParams.get("autoId");

    if (this.customer.memberId && this.customer.autoId) {
      this.customerType = 4;
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
    }
  }

  getRecord(autoId) {
    this.Websites.httpPost('findOrderInfoByAutoId', { autoId: autoId }).subscribe(res => {
      if (res) {
        if (res.count4Working) {
          if (res.count4Working.length > 0) {
            this.hasNum = res.count4Working.length;
          }
        }
        if (res.count4Completed) {
          if (res.count4Completed.length > 0) {
            this.lastNum = res.count4Completed[0].settlementTime;
          }
        }

        if (res.hasOwnProperty('count4Working') && res.count4Working.length > 0) {
          let popover = this.popoverCtrl.create(toastProjectPopoverComponent, { msg: "当前已有车牌”" + this.customer.plateNumber + "“进行中的订单，请确认操作？" }, { cssClass: "addProjectPopover" });
          popover.onDidDismiss(data => {
            if (data) {
              location.href = WebConfig.server_ + '/czbbb/order/orderDetailViewNew.jsp?orderId=' + res.count4Working[0].orderId;
            }
          });
          popover.present();
        }
      }
    })
  }
  //获取接车信息
  findService(memberId?) {
    this.Websites.httpPost("findWashCarService4Order", { memberId: memberId, service: true },true).subscribe(res => {
      if (res['mcardServices']) this.mcardServices = res['mcardServices'];
      if (res['services']) this.servicesList = res['services'];

    })
  }

  //获取客户信息
  findmember(memberId) {
    let params = { memberId: memberId, auto: true }
    this.Websites.httpPost('findmember', params).subscribe(res => {

      res.autoId = this.customer.autoId;
      this.amountUnpaid = res.suspendedMoney.amountUnpaid;

      if (res.autos.length >= 0) {
        res.autos.forEach(a => {
          if (a.autoId == this.customer.autoId) {
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

      // this.getRecord(this.customer.autoId);
      if (typeof this.customer.mobileNumber == "string" && this.customer.mobileNumber.length > 0) this.isNullmobileNumber = false;
    })
  }

  //获取默认省份
  findStoreExt() {
    this.Websites.httpPost('findStoreExt', {}).subscribe(res => {
      this.carInfo.provinces = res.defCtiyPrefix;
    })
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
      this.Websites.httpPost('getMemberDetailedByPlateNumber', params).subscribe(res => {
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
    this.csModal.showProvince(ProvincesPage, {},1,(data) => {
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
  }

  //添加送修人
  presentPrompt() {
    let popover = this.popoverCtrl.create(AgentPopoverComponent, {}, { cssClass: "agentPopover" });
    popover.onDidDismiss(data => {
      if (data) this.sendInfor = data;
    });
    popover.present();
  }

  //选择技师和销售
  goOrderSelect() {
    let $this = this;
    let demo = function (list) {
      return new Promise((resolve) => {

        list.forEach(single => {
          single.isSalesman = 0;
        });
        $this.technicianList = list;

        resolve();
      })
    }



    this.navCtrl.push(OrderEditSelectPage, {
      callback: demo,
      list: this.technicianList
    });
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

    let selectService = this.siftServices();

    if (selectService.length == 0) {
      this.presentOtherAlert('请选择洗车项目');
      return;
    }

    if ((CarNo && this.isNewCar) || !this.isNewCar) {
      this.presentAlert("确定提交订单？");
    } else {
      this.presentToast('请输入正确的车牌号，如粤A88888');
    }

  }

  saveAsorder() {
    let member = {
      memberId: this.customer.memberId,
      memberName: this.customer.memberName,
      mobileNumber: this.customer.mobileNumber
    }

    let services = this.siftServices();
    services.forEach(s => {
      s.staff = this.technicianList;
    })

    let params = {};
    params['orderTypeId'] = '5';
    params['orderAmount'] = this.priceInfo.totalPrice;
    params['discountAmount'] = this.priceInfo.discountAmount;
    params['sendUname'] = this.sendInfor.sendUname;
    params['sendMobile'] = this.sendInfor.sendMobile;
    params['member'] = member;

    if (this.isNewCar) {
      this.carInfo['plateNumber'] = this.carInfo.provinces + this.carInfo.plateNB.toUpperCase();
      params['auto'] = this.carInfo;
    } else {
      params['auto'] = this.selectCar;
    }
    params['services'] = services;


    this.Websites.httpPost('saveAsorder', params).subscribe(res => {
      this.navCtrl.push(orderPostPage, { autoId: res.autoId, orderId: res.orderId, pickupMileage: this.pickupMileage });
    }, error => {
      // this.csModal.showToast(error.body.msg);
    });
  }


  //抽出选中的项目
  siftServices() {
    let selectService = [];
    for (var key in this.servicesList) {
      var service = this.servicesList[key];
      service.select && selectService.push(service);
    }

    for (var key2 in this.mcardServices) {
      var service2 = this.mcardServices[key2];
      service2.select && selectService.push(service2);
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


  presentAlert(msg, info?, inputType?) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            if (inputType) {
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
            } else {
              this.saveAsorder();
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

  close() {
    this.amountUnpaid = 0;
  }

  closewin() {
    this.csbzNave.closewin();
  }


}
