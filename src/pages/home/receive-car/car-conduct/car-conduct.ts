import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, PopoverController, ToastController, App, Content } from 'ionic-angular';
import { OrderEditSelectPage } from '../order-edit/order-edit-select/order-edit-select';
import { carEditPage } from '../car-edit/car-edit';
import { carAddProPage } from '../car-add-pro/car-add-pro';
import { carSelectProPage } from '../car-select-pro/car-select-pro';
import { carSelectPjPage } from '../car-select-pj/car-select-pj';
import { CsModal } from '../../../../providers/cs-modal';
import { MntcSelectPage } from '../../../other/mntc-select/mntc-select';
import { WebSites } from '../../../../providers/web-sites';
import { carEditPjPage } from '../car-edit-pj/car-edit-pj';
import { toastProjectPopoverComponent } from '../../../other/toast-project-popover/toast-project-popover';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { OrderDetailPage } from '../../../order/order-detail/order-detail';
import { ConsumerMsgPage } from '../../custom/consumer-msg/consumer-msg';
export interface member {
  memberId: string;
  memberName: string;
  mobileNumber: string;
  plateNumber: string;
  autoId: string;
}
@Component({
  selector: 'page-car-conduct',
  templateUrl: 'car-conduct.html',
})


export class carConductPage {

  @ViewChild(Content) content: Content;

  isNave: boolean;
  public flag = false;//控制显示隐藏 点击更多
  public flag_ = false;
  public makeAllPrice: number = 0;
  public pjAllPrice: number = 0;
  public poAllPrice: number = 0;
  goods = [];
  clMsg: any = { cardNum: 0 };
  bindUid;
  userName;
  userName_;
  keyWords;
  orderId;
  selectCla = { mntc_class_name: '', mntc_class_id: '' };
  selectUser = { servuce_name: '' };
  public title = '点击完善更多信息';
  customer: member = { memberId: '', memberName: '', mobileNumber: "", plateNumber: "", autoId: '' };
  public allSelectPro = [];
  public allSelectPj = [];
  staffS = [];
  serviceS = [];
  amountUnpaid;
  public courseTab = [
    { "name": "项目 ", "bol": true },
    { "name": "配件", "bol": false }
  ];

  saveAllPro = [];
  saveAll = {
    orderId: '', orderTypeId: '6', originalNo: '', memo: '', orderAmount: '', discountAmount: 0, pickupMileage: '', pickupUid: '', pickupUname: '', agentUid: '', faultDesc: '', mntcAdvice: '', estimatedTime: '', pickupTime: '', sendUname: '', sendMobile: '', warmTips: '', notifyTags: '', mntcClassId: 0, pickupCode: '',
    auto: {
      autoId: '',
      plateNumber: '',
      automakeName: '',
      automodelName: '',
      autotypeName: '',
      autotypeId: '',
      automodelId: '',
      automakeId: '',
      auditDate: '',
      currentMileage: '',
      biEdate: '',
      vinCode: '',
      engineNo: ''
    },
    member: {
      memberId: '',
      memberName: '',
      mobileNumber: ''
    },
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public csModal: CsModal, public websites: WebSites, public popoverCtrl: PopoverController, public toastCtrl: ToastController, public csbzNave: CsbzNave, public app: App, public changeDetectorRef: ChangeDetectorRef) {
    this.isNave = this.csbzNave.isNave(this.navCtrl.getViews().length);
  }
  ionViewDidLoad() {
    if (this.navParams.get('customer')) {
      this.customer = this.navParams.get('customer');
      this.saveAll.member.memberId = this.customer.memberId;
      this.saveAll.member.memberName = this.customer.memberName;
      this.saveAll.member.mobileNumber = this.customer.mobileNumber;
      this.saveAll.auto.autoId = this.customer.autoId;
    }

    if (this.navParams.get('orderId')) {
      this.orderId = this.navParams.get("orderId");
      let params = { orderId: this.orderId };
      this.websites.httpPost('findAsorderByOrderId', params).subscribe(res => {
        if (res) {

          this.flag_ = true;
          this.saveAll.auto.plateNumber = this.customer.plateNumber = res.plateNumber;
          this.saveAll.orderId = res.orderId;
          this.saveAll.auto.autoId = this.customer.autoId = res.autoId || '';
          this.saveAll.orderTypeId = res.orderTypeId;
          this.saveAll.originalNo = res.originalNo || '';
          this.saveAll.memo = res.memo || '';
          this.saveAll.orderAmount = res.orderAmount;
          this.saveAll.discountAmount = res.discountAmount;
          this.saveAll.pickupUname = res.pickupUname || '';
          this.saveAll.agentUid = res.agentUid || '';
          this.saveAll.faultDesc = res.faultDesc || '';
          this.saveAll.mntcAdvice = res.mntcAdvice || '';
          this.saveAll.estimatedTime = res.estimatedTime || '';
          this.saveAll.sendUname = res.sendUname || '';
          this.saveAll.sendMobile = res.sendMobile || '';
          this.saveAll.warmTips = res.warmTips || '';
          this.saveAll.notifyTags = res.notifyTags || '';
          this.saveAll.mntcClassId = res.mntcClassId;
          this.saveAll.pickupCode = res.pickupCode || '';
          this.saveAll.pickupMileage = res.pickupMileage || '';
          this.selectUser.servuce_name = res.agentUname || '';
          this.saveAll.pickupTime = res.pickupTime || '';
          switch (this.saveAll.mntcClassId) {
            case 0:
              this.selectCla.mntc_class_name = '普通维修';
              break;
            case 1:
              this.selectCla.mntc_class_name = '保险维修';
              break;
            case 2:
              this.selectCla.mntc_class_name = '内部维修';
              break;
            case 3:
              this.selectCla.mntc_class_name = '其他维修';
              break;
            default:
              this.selectCla.mntc_class_name = '普通维修';
          }
          if (res.services) {
            this.serviceS = res.services;

            this.saveAll["services"] = res.services;

            this.saveAll["services"].forEach(element => {
              element.showServicePrice = element.servicePrice * element.serviceCoefficient / 100;
              this.poAllPrice += element.totalAmount;
            });
          }
          if (res.goods) {
            this.goods = res.goods;
            this.saveAll["goods"] = this.goods;
            this.saveAll["goods"].forEach(element => {
              element.showGoodsPrice = element.goodsPrice;
              this.pjAllPrice += element.totalAmount;
            });
          }
          this.totalAll();
          this.findmember(res.memberId);
        }
      })
    }
    if (this.navParams.get('res')) {
      this.saveAll.member.memberId = this.navParams.get('res').memberId;
      this.saveAll.auto.autoId = this.navParams.get('res').autoId;
      this.customer.autoId = this.navParams.get('res').autoId;
      this.customer.memberId = this.navParams.get('res').memberId;
      this.saveAll.auto.plateNumber = this.customer.plateNumber = this.navParams.get("carNum");
    }


    if (!this.orderId) {
      this.findmember(this.saveAll.member.memberId);
      this.websites.httpPost('findOrderInfoByAutoId', { autoId: this.saveAll.auto.autoId }).subscribe(res => {
        if (res != null) {
          if (res.count4Working && res.count4Working.length > 0) {
            let popover = this.popoverCtrl.create(toastProjectPopoverComponent, { msg: "当前车牌”" + this.customer.plateNumber + "“存在未完成的维修订单，是否继续接单？" }, { cssClass: "addProjectPopover" });
            popover.onDidDismiss(data => {
              if (data) {
                //location.href = WebConfig.server_ + '/czbbb/order/orderDetailViewNew.jsp?orderId=' + res.count4Working[0].orderId;
                this.navCtrl.push(OrderDetailPage, { orderId: res.count4Working[0].orderId });
              }
            });
            popover.present();
          }
        }
      }, error => {
        console.error(error);
      })
    }
  }
  //获取客户信息
  findmember(memberId) {
    let params = { memberId: memberId, auto: true }
    this.websites.httpPost('findmember', params, false).subscribe(res => {
      this.bindUid = res.bindUid;
      this.amountUnpaid = res.suspendedMoney.amountUnpaid;
      var element = document.getElementById("wechat");
      var element1 = document.getElementById("card");
      if (this.bindUid) {
        element.setAttribute('src', 'assets/imgs/ico-wechat1.png');
      } else {
        element.setAttribute('src', 'assets/imgs/msg_06.gif');
      }
      if (res.cardNum > 0) {
        element1.setAttribute('src', 'assets/imgs/hasCard.png');
      } else {
        element1.setAttribute('src', 'assets/imgs/card_03.gif');
      }
      res.autos.forEach(element => {
        if (this.customer.autoId == element.autoId) {
          this.saveAll.auto = element;
        }
      });
      this.saveAll.member.memberName = res.memberName;
      this.saveAll.member.mobileNumber = res.mobileNumber;
      this.clMsg = res;
      this.clMsg['plateNumber'] = this.customer.plateNumber;
      this.clMsg['memberId'] = memberId;
      this.customer.memberName = res.memberName || res.mobileNumber;
      if (this.orderId) {
        this.customer.autoId = res.autos.autoId;
        this.customer.memberId = res.memberId;
        this.customer.mobileNumber = res.mobileNumber;
        this.customer.plateNumber = res.plateNumber;

      }
    }, error => {
      console.error(error);
    })
  }

  toggleTab(item, list) {

    for (var i = 0; i < list.length; i++) {
      list[i].bol = false;
      if (item == list[i].name) {
        list[i].bol = true;
      }
    }
    this.changeDetectorRef.detectChanges();

  }
  showSelect(type) {
    let $this = this;
    let demo;
    demo = function (data) {
      return new Promise((resolve, reject) => {

        if (data != '') {
          $this.saveAll.agentUid = data.userId;
          $this.selectUser.servuce_name = data.userName;
        }
        resolve();
      })
    }
    this.navCtrl.push(OrderEditSelectPage, { callback: demo, flagType: type });

  }
  showProvince() {
    this.csModal.showProvince(MntcSelectPage,{}, (data) => {
      this.selectCla = data;
      this.saveAll.mntcClassId = data.mntc_class_id;

    });
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
  goCardEdit() {
    let $this = this;
    let callback = function () {
      return new Promise((resolve, reject) => {
        $this.findmember($this.saveAll.member.memberId);
        resolve();
      })
    }
    this.navCtrl.push(carEditPage, { carInfo: this.clMsg, callback: callback });
  }
  goCusMsg() {

  }
  addProjuct(i) {
    let $this = this;
    let demo;
    demo = function (data) {
      console.log(data);
      return new Promise((resolve, reject) => {
        if (data != '') {
          $this.poAllPrice = 0;
          $this.flag_ = true;

          $this.serviceS.push(data);
          $this.saveAll["services"] = $this.serviceS;
          $this.saveAll["services"].forEach(element => {
            $this.poAllPrice += element.totalAmount;
          });
          $this.totalAll();
        }
        resolve();
      })
    }
    this.navCtrl.push(carAddProPage, { addpro: i, callback: demo });
  }
  selectProject(memberId) {
    let $this = this;
    let demo;
    demo = function (data) {
      return new Promise((resolve, reject) => {
        if (data != '') {
          $this.poAllPrice = 0;
          $this.flag_ = true;
          $this.serviceS.push(data);
          $this.saveAll["services"] = $this.serviceS;
          $this.saveAll["services"].forEach(element => {
            $this.poAllPrice += element.totalAmount;
          });
          $this.totalAll();
        }
        resolve();
      })
    }
    this.navCtrl.push(carSelectProPage, { memberId: memberId, callback: demo, PType: 'conduct' });
  }
  selectPj(type) {
    let $this = this;
    let demo;
    demo = function (data) {
      return new Promise((resolve, reject) => {
        if (data != '') {
          $this.pjAllPrice = 0;
          $this.flag_ = true;
          if($this.goods.length != 0){//判断选择的配件跟原来的配件是否有可以合并的
            for(let i=0;i<$this.goods.length;i++){
              if($this.goods[i].goodsId == data.goodsId 
                && $this.goods[i].sellUid == data.sellUid 
                && $this.goods[i].discountCoefficient == data.discountCoefficient
              ){
                $this.goods[i].goodsNum += data.goodsNum;
                $this.goods[i].totalAmount += data.totalAmount;
                data = {};
                break;
              }
            }
            if(JSON.stringify(data) != "{}"){
              $this.goods.push(data);
            }
          }else{
            $this.goods.push(data);
          }
          $this.saveAll["goods"] = $this.goods;
          $this.saveAll["goods"].forEach(element => {

            $this.pjAllPrice += element.totalAmount;
          });
          $this.totalAll();
        }
        resolve();
      })
    }
    this.navCtrl.push(carSelectPjPage, { callback: demo, type: type, addpro: '编辑配件' });
  }

  save_() {
    this.websites.httpPost('saveAsorder', this.saveAll, true, false).subscribe(res => {
      if (res != null) {
        this.navCtrl.popToRoot();
        this.navCtrl.parent.select(1);
      }
    }, error => {
      this.csModal.showToast(error.body.msg);
    })
  }
  //修改项目
  toEdit(item, i) {
    let $this = this;
    let demo;
    $this.poAllPrice = 0;
    demo = function (data) {
      return new Promise((resolve, reject) => {
        if (data != '') {
          $this.flag_ = true;
          item = data;
          $this.saveAll["services"].forEach(element => {
            $this.poAllPrice += element.totalAmount;
          });
        } else {
          $this.serviceS.splice(i, 1);
          $this.saveAll["services"] = $this.serviceS;
          $this.saveAll["services"].forEach(element => {
            $this.poAllPrice += element.totalAmount;
          });
        }
        $this.totalAll();
        resolve();
      })
    }
    this.navCtrl.push(carAddProPage, { callback: demo, item: item, addpro: '项目修改' });
  }
  //修改配件
  toEditPj(item, i) {
    let $this = this;
    let demo;
    $this.pjAllPrice = 0;
    demo = function (data) {
      return new Promise((resolve, reject) => {
        if (data != '') {
          // item = data;
          if($this.goods.length > 1){//判断修改之后的配件跟原来的配件是否有可以合并的
            for(let j=0;j<$this.goods.length;j++){
              if(i != j){
                if($this.goods[j].goodsId == data.goodsId 
                  && $this.goods[j].sellUid == data.sellUid 
                  && $this.goods[j].discountCoefficient == data.discountCoefficient
                ){
                  $this.goods[j].goodsNum += data.goodsNum;
                  $this.goods[j].totalAmount += data.totalAmount;
                  $this.goods.splice(i, 1);
                  $this.saveAll["goods"] = $this.goods;
                  break;
                }
              }
            }
          }
          $this.saveAll["goods"].forEach(element => {
            $this.pjAllPrice += element.totalAmount;
          });

        } else {//在修改配件修改页面被删除
          $this.goods.splice(i, 1);
          $this.saveAll["goods"] = $this.goods;
          $this.saveAll["goods"].forEach(element => {
            $this.pjAllPrice += element.totalAmount;
          });
        }
        $this.totalAll();
        resolve();
      })
    }
    this.navCtrl.push(carEditPjPage, { callback: demo, item: item, addpro: '配件修改' });
  }
  totalAll() {
    this.makeAllPrice = 0;
    if (this.saveAll["services"]) {
      this.saveAll["services"].forEach(element => {
        this.makeAllPrice += element.totalAmount;
      });
    }
    if (this.saveAll["goods"]) {
      this.saveAll["goods"].forEach(element => {
        this.makeAllPrice += element.totalAmount;
      });
    }

  }

  close() {
    this.amountUnpaid = 0;
  }

  closewin() {
    this.csbzNave.closewin();
  }
  goCustomMsg() {
    this.navCtrl.push(ConsumerMsgPage, { consumer: this.customer });
  }

  focusFun(){
    this.scrollTokeyboardHeight();
  }
  scrollTokeyboardHeight() {//让content向上滚动 软键盘的高度
    window.addEventListener('native.keyboardshow',(e:any) =>{
    this.content.scrollTo(0,e.keyboardHeight);
    });
  }
}
