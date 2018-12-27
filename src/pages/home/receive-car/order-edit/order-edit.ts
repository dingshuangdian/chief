import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { OrderEditSelectPage } from './order-edit-select/order-edit-select';
import { orderPostPage } from '../order-post/order-post';
import { WebSites } from '../../../../providers/web-sites';
import { addProjectPopoverComponent } from '../../../other/add-project-popover/add-project-popover';
import { discountPopover } from '../../../other/discount-popover/discount-popover';
import { carSelectProPage } from '../car-select-pro/car-select-pro';
import { resourcesStaticProvider } from '../../../../providers/resources-static';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { CsModal } from '../../../../providers/cs-modal';
import { Storage } from '@ionic/storage';
import { hycountPopover } from '../../../other/hycount-popover/hycount-popover';
@Component({
  selector: 'page-order-edit',
  templateUrl: 'order-edit.html',
})
export class orderEditPage {
  isNave: boolean;
  orderId: string;
  allInfo: any;
  svctypeList = [];
  priceInfo = { totalPrice: 0, servicePrice: 0, projePrice: 0, discountAmount: 0 };
  member = { memberName: '', mobileNumber: '', memberId: '' };
  auto = { plateNumber: "", autoId: "" };
  sendInfo = { sendUname: "", sendMobile: "" };
  services = [];
  addServices = [];
  discountCoefficient = [];
  mrdiscountCoefficient = {};
  minMrdiscountCoefficient;
  minWxdiscountCoefficient;
  wxdiscountCoefficient = {};
  defaultSvctypeId: number;
  otherInfo = {
    orderId: "",
    originalNo: "",
    memo: "",
    warmTips: "",
    pickupCode: "",
    pickupUname: "",
    agentUid: "",
    faultDesc: "",
    mntcAdvice: "",
    estimatedTime: "",
    notifyTags: "",
    pickupMileage: "",
    mntcClassId: ""
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public webSites: WebSites,
    public popoverCtrl: PopoverController,
    public servicsData: resourcesStaticProvider,
    private alertCtrl: AlertController,
    private csbzNave: CsbzNave,
    private csModal: CsModal,
    public storage: Storage
  ) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
    this.orderId = this.navParams.get("orderId");
    this.allInfo = this.navParams.get('allInfo');
  }
  ionViewDidLoad() {
    this.findServiceTypeTree();
    if (this.allInfo) {
      this.member = this.allInfo['member'] || {};
      this.auto = this.allInfo['auto'] || this.auto;
      this.priceInfo = this.allInfo['priceInfo'] || this.priceInfo;
      this.services = this.allInfo['services'] || [];
      if (this.member['memberId']) {
        this.findmcardDiscount(this.member['memberId']);
      }
      this.addServices = this.allInfo['addServices'] || [];
      this.addServices.forEach(s => {
        this.methodSinglePrice(s);
      });
      this.otherInfo.pickupMileage = this.allInfo["pickupMileage"] || "";
    } else if (this.orderId) {
      this.findAsorderByOrderId();
    }
  }
  initData(s) {
    if (s["gsDiscountCoefficient"]) {
      s.serviceCoefficient = s.useHy ? s["gsDiscountCoefficient"][0].discountCoefficient : 100;
      s.discountId = s["gsDiscountCoefficient"][0].discountId;
    }
    if (s["cpDiscountCoefficient"]) {
      s.goodsCoefficient = s.useHy ? s["cpDiscountCoefficient"][0].discountCoefficient : 100;
      s.goodsDiscountId = s["cpDiscountCoefficient"][0].discountId;
    }
    this.methodSinglePrice(s);

  }
  findAsorderByOrderId() {
    let params = { orderId: this.orderId };
    this.webSites.httpPost('findAsorderByOrderId', params,true).subscribe(res => {
      if (res) {
        this.otherInfo.orderId = res['orderId'] || '';
        this.otherInfo.originalNo = res['originalNo'] || '';
        this.otherInfo.memo = res['memo'] || '';
        this.otherInfo.warmTips = res['warmTips'] || '';
        this.otherInfo.pickupCode = res['pickupCode'] || '';
        this.otherInfo.pickupUname = res['pickupUname'] || '';
        this.otherInfo.agentUid = res['agentUid'] || '';
        this.otherInfo.faultDesc = res['faultDesc'] || '';
        this.otherInfo.mntcAdvice = res['mntcAdvice'] || '';
        this.otherInfo.estimatedTime = res['estimatedTime'] || '';
        this.otherInfo.notifyTags = res['notifyTags'] || '';
        this.otherInfo.pickupMileage = res['pickupMileage'] || '';
        this.otherInfo.mntcClassId = res['mntcClassId'] || '';
        this.priceInfo.totalPrice = res['orderAmount'] || '';
        this.priceInfo.discountAmount = res['discountAmount'] || '';
        this.auto.autoId = res['autoId'] || '';
        this.member.memberId = res['memberId'] || '';
        this.findmember(this.member.memberId);
        this.findmcardDiscount(this.member.memberId);
        this.services = res['services'] || [];
        this.addAttribute();
      }
    })
  }


  findmcardDiscount(memberId) {
    let params = { memberId: memberId }
    this.webSites.httpPost('findmcardDiscount', params).subscribe(res => {
      this.discountCoefficient = res;
      if (this.discountCoefficient) {
        this.discountCoefficient.forEach(res => {
          if (res.discountTypeId == 2) {
            if (!this.mrdiscountCoefficient[res.svctypeId]) {
              this.mrdiscountCoefficient[res.svctypeId] = [];
            }
            this.mrdiscountCoefficient[res.svctypeId].push(res);
          }
          if (res.discountTypeId == 1) {
            if (!this.wxdiscountCoefficient[res.svctypeId]) {
              this.wxdiscountCoefficient[res.svctypeId] = [];
            }
            this.wxdiscountCoefficient[res.svctypeId].push(res);
          }
        })
        if (this.orderId) {
          this.services.forEach(s => {
            s['useHy'] = true;
            s['goodsDiscountId'] = s.goodsDiscountId || '';
            s['discountId'] = s.discountId || '';
            if (this.mrdiscountCoefficient[s.svctypePId]) {
              s["cpDiscountCoefficient"] = this.mrdiscountCoefficient[s.svctypePId];
            }
            if (this.wxdiscountCoefficient[s.svctypePId]) {
              s["gsDiscountCoefficient"] = this.wxdiscountCoefficient[s.svctypePId];
            }
          });
        } else {
          this.services.forEach(s => {
            s['useHy'] = true;
            s['goodsDiscountId'] = s.goodsDiscountId || '';
            s['discountId'] = s.discountId || '';
            if (this.mrdiscountCoefficient[s.svctypePId]) {
              s["cpDiscountCoefficient"] = this.mrdiscountCoefficient[s.svctypePId];
              s.goodsCoefficient = s["cpDiscountCoefficient"][0].discountCoefficient;
              s.goodsDiscountId = s["cpDiscountCoefficient"][0].discountId;
            }
            if (this.wxdiscountCoefficient[s.svctypePId]) {
              s["gsDiscountCoefficient"] = this.wxdiscountCoefficient[s.svctypePId];
              s.serviceCoefficient = s["gsDiscountCoefficient"][0].discountCoefficient;
              s.discountId = s["gsDiscountCoefficient"][0].discountId;
            }
            this.methodSinglePrice(s);
          });
        }

        window.localStorage.setItem('mrNum', JSON.stringify(this.mrdiscountCoefficient));//产品折扣
        window.localStorage.setItem('wcNum', JSON.stringify(this.wxdiscountCoefficient));//工时折扣
      }
    }, error => {
      console.error(error);
    })
  }
  //获取客户信息
  findmember(memberId) {
    let params = { memberId: memberId, auto: true }
    this.webSites.httpPost('findmember', params).subscribe(res => {
      res.autos.forEach(a => {
        if (a.autoId == this.auto.autoId) {
          this.auto = a;
        }
      })
      this.member.memberId = res['memberId'] || '';
      this.member.mobileNumber = res['mobileNumber'] || '';
      this.member.memberName = res['memberName'] || '';
    })
  }
  //获取服务分类
  findServiceTypeTree(svctypePId?) {
    let params = {}
    if (svctypePId) params["svctypePId"] = svctypePId;
    this.webSites.httpPost('findServiceTypeTree', params).subscribe(res => {
      this.svctypeList = res;
      this.svctypeList.forEach(element => {
        element["svctypePId"] = element.svctypeId;
        if (element.svctypeName == "维修") this.defaultSvctypeId = element.svctypeId
      });
    }, error => {
      console.error(error);
    })
  }
  //初始化服务其他属性
  addAttribute() {
    this.services.forEach(i => {
      i.servicePrice = i.servicePrice || 0;
      i.goodsPrice = i.goodsPrice || 0;
      i.serviceNum = i.serviceNum || 1;
      i.goodsNum = i.goodsNum || 1;
      i.serviceCoefficient = i.serviceCoefficient || 100;
      i.goodsCoefficient = i.goodsCoefficient || 100;
      i.staff = i.staff || [];
      if (i.staff.length > 0) {
        i.technicianList = [];
        i.salesmanList = [];
        i.staff.forEach(st => {
          if (st.isSalesman == 0) {
            i.technicianList.push(st);
          } else if (st.isSalesman == 1) {
            i.salesmanList.push(st);
          }
        });
      }
      this.methodSinglePrice(i);
    })
  }
  //界面操作
  //添加自定义的项目
  zdyEdit() {
    let popover = this.popoverCtrl.create(addProjectPopoverComponent, {}, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (data) {
        var serviceItem = {
          svctypeId: this.defaultSvctypeId,
          serviceName: "",
          discountAmount: 0,
          totalAmount: 0,
          serviceNum: 0,
          servicePrice: 0,
          goodsNum: 0,
          goodsPrice: 0,
          serviceCoefficient: 100,
          goodsCoefficient: 100
        };
        if (data.project) {
          serviceItem['projectItem'] = true;
          serviceItem['goodsNum'] = 1;
          serviceItem['useHy'] = true;
          serviceItem['goodsDiscountId'] = '';
          serviceItem['discountId'] = '';
          if (this.mrdiscountCoefficient[serviceItem.svctypeId]) {
            serviceItem["cpDiscountCoefficient"] = this.mrdiscountCoefficient[serviceItem.svctypeId];
            serviceItem.goodsCoefficient = serviceItem["cpDiscountCoefficient"][0].discountCoefficient;
            serviceItem["goodsDiscountId"] = serviceItem["cpDiscountCoefficient"][0].discountId;
          }
          if (this.wxdiscountCoefficient[serviceItem.svctypeId]) {
            serviceItem["gsDiscountCoefficient"] = this.wxdiscountCoefficient[serviceItem.svctypeId];
            serviceItem.serviceCoefficient = serviceItem["gsDiscountCoefficient"][0].discountCoefficient;
            serviceItem["discountId"] = serviceItem["gsDiscountCoefficient"][0].discountId;
          }
        }
        if (data.service) {
          serviceItem['serviceItem'] = true;
          serviceItem['serviceNum'] = 1;
          serviceItem['useHy'] = true;
          serviceItem['goodsDiscountId'] = '';
          serviceItem['discountId'] = '';
          if (this.mrdiscountCoefficient[serviceItem.svctypeId]) {
            serviceItem["cpDiscountCoefficient"] = this.mrdiscountCoefficient[serviceItem.svctypeId];
            serviceItem.goodsCoefficient = serviceItem["cpDiscountCoefficient"][0].discountCoefficient;
            serviceItem["goodsDiscountId"] = serviceItem["cpDiscountCoefficient"][0].discountId;
          }
          if (this.wxdiscountCoefficient[serviceItem.svctypeId]) {
            serviceItem["gsDiscountCoefficient"] = this.wxdiscountCoefficient[serviceItem.svctypeId];
            serviceItem.serviceCoefficient = serviceItem["gsDiscountCoefficient"][0].discountCoefficient;
            serviceItem["discountId"] = serviceItem["gsDiscountCoefficient"][0].discountId;
          }
        }
        this.addServices.splice(0, 0, serviceItem);
      }
    });
    popover.present();
  }
  //添加请求的项目
  addPresentProject() {
    let $this = this;
    let callback = function (selectService) {
      selectService.forEach(s => {
        s['goodsDiscountId'] = '';
        s['discountId'] = '';
        s['useHy'] = true;
        if ($this.mrdiscountCoefficient[s.svctypePId]) {
          s["cpDiscountCoefficient"] = $this.mrdiscountCoefficient[s.svctypePId];
          s.goodsCoefficient = s["cpDiscountCoefficient"][0].discountCoefficient;
          s.goodsDiscountId = s["cpDiscountCoefficient"][0].discountId;
        }
        if ($this.wxdiscountCoefficient[s.svctypePId]) {
          s["gsDiscountCoefficient"] = $this.wxdiscountCoefficient[s.svctypePId];
          s.serviceCoefficient = s["gsDiscountCoefficient"][0].discountCoefficient;
          s.discountId = s["gsDiscountCoefficient"][0].discountId;
        }

      });
      return new Promise((resolve, reject) => {
        $this.services = selectService.concat($this.services);
        $this.services.forEach(s => {
          $this.methodSinglePrice(s);
        });
        resolve();
      })
    }
    this.navCtrl.push(carSelectProPage, { callback: callback, memberId: this.member.memberId, PType: "common", services: this.services });
  }
  //选大类型
  changeSvctype(s) {
    s.svctypeId = s.svctype.svctypeId;
    if (s.useHy) {
      if (this.mrdiscountCoefficient[s.svctype.svctypeId]) {
        s["cpDiscountCoefficient"] = this.mrdiscountCoefficient[s.svctype.svctypeId];
        s.goodsCoefficient = s["cpDiscountCoefficient"][0].discountCoefficient;
        s.goodsDiscountId = s["cpDiscountCoefficient"][0].discountId;
      } else {
        s["cpDiscountCoefficient"] = "";
        s.goodsCoefficient = 100;
        s.goodsDiscountId = "";
      }
    } else {
      s["cpDiscountCoefficient"] = "";
      s.goodsCoefficient = 100;
      s.goodsDiscountId = "";
    }
    if (s.useHy) {
      if (this.wxdiscountCoefficient[s.svctype.svctypeId]) {
        s["gsDiscountCoefficient"] = this.wxdiscountCoefficient[s.svctype.svctypeId];
        s.serviceCoefficient = s["gsDiscountCoefficient"][0].discountCoefficient;
        s.discountId = s["gsDiscountCoefficient"][0].discountId;
      } else {
        s["gsDiscountCoefficient"] = "";
        s.serviceCoefficient = 100;
        s.discountId = "";
      }
    }
    else {
      s["gsDiscountCoefficient"] = "";
      s.serviceCoefficient = 100;
      s.discountId = "";
    }
  }

  //删除项目
  delect(s, num) {
    if (s.serviceId) {
      s.select = false;
      this.services.splice(num, 1);
    } else {
      this.addServices.splice(num, 1);
    }
    this.methodAllPrice();
  }
  //输入单价 
  inputPrice(s, num) {
    num = num == '' ? 0 : num;
    let $this = this;
    setTimeout(function () {
      $this.methodSinglePrice(s);
    }, 1000);
  }
  //选择折扣
  discountSelect(type, s) {
    let popover = this.popoverCtrl.create(discountPopover, {}, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (data) {
        if (type == 1) {
          s.goodsCoefficient = data;
        }
        if (type == 2) {

          s.serviceCoefficient = data;
        }
        this.methodSinglePrice(s);
      }
    });
    popover.present();
  }
  //选择会员折扣
  hyDiscountSelect(type, v, s) {
    let popover = this.popoverCtrl.create(hycountPopover, { t: type, v: v }, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (data) {
        if (v == 1) {
          s.goodsCoefficient = data["discountCoefficient"];
          s.goodsDiscountId = data["discountId"];
        }
        if (v == 2) {
          s.serviceCoefficient = data["discountCoefficient"];
          s.discountId = data["discountId"];
        }
        this.methodSinglePrice(s);
      }
    });
    popover.present();
  }
  //输入折扣
  discountInput(type, s) {
  }
  //商品数量加减
  methodNum(type, s) {
    if (type) {
      s.goodsNum++;
    } else {
      if (s.goodsNum > 0)
        s.goodsNum--;
    }
    this.methodSinglePrice(s);
  }
  //输入商品数量
  inputNum(s) {

  }

  //服务数量加减
  methodServiceNum(type, s) {
    if (type) {
      s.serviceNum++;
    } else {
      if (s.serviceNum > 0)
        s.serviceNum--;
    }
  }

  //输入服务数量
  inputServiceNum(s) {

  }

  //选择技师和销售
  goOrderSelect(type, s) {
    let demo = function (list) {
      return new Promise((resolve) => {
        if (type == 1) {
          list.forEach(single => {
            single.isSalesman = 0;
          });
          s.technicianList = list;
        } else if (type == 2) {
          list.forEach(single => {
            single.isSalesman = 1;
          });
          s.salesmanList = list;
        }
        resolve();
      })
    }

    let list = type == 1 ? s.technicianList : s.salesmanList;

    this.navCtrl.push(OrderEditSelectPage, {
      callback: demo,
      list: list
    });
  }


  //提交
  onConfirm() {

    if (this.services.length == 0 && this.addServices.length == 0) {
      this.presentAlert('订单项不能为空');
      return;
    }

    if (this.addServices.length > 0) {
      for (let i = 0; i < this.addServices.length; i++) {
        const s = this.addServices[i];
        if (s.serviceName == "") {
          this.presentAlert('自定义产品项产品名不能为空');
          return;
        }
      }
    }
    this.presentConfirmAlert(this.priceInfo.totalPrice);
  }
  saveAsorder() {
    let member = {
      memberId: this.member.memberId,
      memberName: this.member.memberName,
      mobileNumber: this.member.mobileNumber
    }
    let services = this.services.concat(this.addServices);
    services.forEach(s => {
      let staff = [];
      if (s.technicianList) {
        staff = staff.concat(s.technicianList);
      }
      if (s.salesmanList) {
        staff = staff.concat(s.salesmanList);
      }
      s.staff = staff;
    })
    let params = this.otherInfo;
    params['orderTypeId'] = '5';
    params['orderAmount'] = this.priceInfo.totalPrice;
    params['discountAmount'] = this.priceInfo.discountAmount;
    params['sendUname'] = this.sendInfo.sendUname;
    params['sendMobile'] = this.sendInfo.sendMobile;
    params['member'] = member;
    params['auto'] = this.auto;
    params['services'] = services;
    console.log(params);
    this.webSites.httpPost('saveAsorder', params).subscribe(res => {
      this.navCtrl.push(orderPostPage, { autoId: res.autoId, orderId: res.orderId, pickupMileage: this.otherInfo.pickupMileage });
    }, error => {
      // this.csModal.showToast(error.body.msg);
    });
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: ['确定']
    });
    alert.present();
  }
  presentConfirmAlert(price) {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '请确定提交订单吗？总价' + price + '元',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.saveAsorder();
          }
        }
      ]
    });
    alert.present();
  }
  //计算小计
  methodSinglePrice(s) {
    let all = s.goodsPrice * s.goodsNum + s.servicePrice * s.serviceNum;
    s.totalAmount = s.goodsPrice * s.goodsCoefficient / 100 * s.goodsNum + s.servicePrice * s.serviceCoefficient / 100 * s.serviceNum;
    s.discountAmount = all - s.totalAmount;
    this.methodAllPrice()
  }
  //计算总价钱
  methodAllPrice() {
    this.priceInfo.projePrice = 0;
    this.priceInfo.servicePrice = 0;
    this.priceInfo.totalPrice = 0;
    this.priceInfo.discountAmount = 0;
    this.addServices.forEach(s => {
      this.priceInfo.projePrice += s.goodsPrice * s.goodsNum * s.goodsCoefficient / 100;
      this.priceInfo.servicePrice += s.servicePrice * s.serviceNum * s.serviceCoefficient / 100;
      this.priceInfo.discountAmount += s.discountAmount;
    })
    this.services.forEach(s => {
      this.priceInfo.projePrice += s.goodsPrice * s.goodsNum * s.goodsCoefficient / 100;
      this.priceInfo.servicePrice += s.servicePrice * s.serviceNum * s.serviceCoefficient / 100;
      this.priceInfo.discountAmount += s.discountAmount;
    })
    this.priceInfo.totalPrice = this.priceInfo.projePrice + this.priceInfo.servicePrice;
  }

  closewin() {
    this.csbzNave.closewin();
  }
}


