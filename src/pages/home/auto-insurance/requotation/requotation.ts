import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SelInsuranceCompPage } from '../sel-insurance-comp/sel-insurance-comp';
import { WebSites } from '../../../../providers/web-sites';
import { CsbzNave } from '../../../../providers/csbz-nave';


/**
 * Generated class for the RequotationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-requotation',
  templateUrl: 'requotation.html',
})
export class RequotationPage {
  forceTag;
  cheSunTag;
  ziRanTag;
  bujimianChesunTag;
  bujimianZiranTag;
  bujimianSheshuiTag;
  bujimianHuahenTag;
  sheShuiTag;
  bujimianChengkeTag;
  daoQiangTag;
  siJiTag;
  bujimianSijiTag;
  bujimianSanzheTag;
  chengKeTag;
  hcXiulichangTag;
  bujimianDaoqiangTag;
  huaHenTag;
  hcSanfangteyueTag;
  boLiTag;
  sanZheTag;
  hcXiulichangTypeTag;
  params = { licenseNo: "", cityCode: "" };
  lastMsg = {
    nextForceStartdate: '', nextBusinessStartdate: ''




  };
  sanZheVal;
  siJiVal;
  boLiVal;
  huaHenVal;
  chengKeVal;
  xiuLiChangVal;
  xiuLiChangGuochan;
  xiuLiChangJinkou;
  insureAgent;
  router;
  recordBool;
  isShow;
  isRenewalDate;
  agentName;
  orderId;
  insureAgentUid;
  newselectCardName;
  newholderCardName;
  cardType;
  infoHolderType;
  infoType;
  carOrArtificial = {};
  //复选框
  valmap = {
    'sanZheTag': 500000,
    'siJiTag': 10000,
    'chengKeTag': 10000,
    'boLiTag': 1,
    'huaHenTag': 10000,
    'hcXiulichangTypeTag': 1,
    'hcXiulichangTag': 0.1
  };
  public foldFlag: boolean = true;// true--折叠 flse--展开 
  public foldMsg = "展开";
  /** 
   * 1--待核保/修改保单/报价/提交 
   * 2--
   **/
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private websize: WebSites,
    private csNav: CsbzNave,
    private toastCtrl: ToastController,
  ) {
    this.router = this.navParams.get('requotationType');
    if (this.navParams.get('licenseNo')) {
      this.params.licenseNo = this.navParams.get('licenseNo');
    }
    this.insureAgentUid = this.navParams.get('userId')
    this.agentName = this.navParams.get("agentName");


    if (this.router == 1) {//自动报价
      this.recordBool = true;
      this.isShow = true;
      this.params.cityCode = this.navParams.get('cityCode');
      this.getInsuranceInfo();


    } else if (this.router == 2) {//人工报价
      this.recordBool = false;
      this.isShow = false;
      this.isRenewalDate = false;
      this.lastMsg['nextForceStartdate'] = new Date().toLocaleDateString();
      this.lastMsg['nextBusinessStartdate'] = new Date().toLocaleDateString();
      this.lastMsg['sanZheBaoE'] = 0;
      this.lastMsg['siJiBaoE'] = 0;
      this.lastMsg['chengKeBaoE'] = 0;
      this.lastMsg['boLiBaoE'] = 0;
      this.lastMsg['huahenBaoE'] = 0;
      this.lastMsg['hcXiuLiCanBaoE'] = 0;
      this.lastMsg['hcXiulichangBaoE'] = 0;
      this.lastMsg['isForceRenewalDate'] = 2;
      this.lastMsg['isBusinessRenewalDate'] = 2;

    } else if (this.router == 3) {//重新报价
      this.recordBool = true;
      this.isShow = true;
      this.orderId = this.navParams.get("orderId");
      // $scope.isRenewalDate = false;
      this.orderDetail();

    } else if (this.router == 6) {//修改保单
      this.recordBool = false;
      this.isShow = false;
      this.isRenewalDate = false;
      this.orderId = this.navParams.get("orderId");
      this.orderDetail();
    }
  }

  ionViewDidLoad() {
    this.getIDCardtype();//获取证件信息
    this.getInsureenumval();//获取保险金额信息
    //this.getHolderPartytype();//获取单位个人信息
    //this.getInsureAgentUList();//获取跟进人员列表
    //this.getInsuranceInfo();
  }

  // 折叠
  fold() {
    this.foldFlag = !this.foldFlag;
    if (this.foldFlag) {
      this.foldMsg = '展开';
    } else {
      this.foldMsg = '收起';
    }
  }
  getIDCardtype() {
    this.websize.httpGet("getIDCardtype", {}).subscribe(res => {
      if (res) {
        this.cardType = res;
      }
    })

  }
  //获取保险金额信息
  getInsureenumval() {
    this.websize.httpGet('getInsureenumval', {}).subscribe(res => {
      if (res) {
        this.sanZheVal = res.sanZhe;
        this.siJiVal = res.siJi;
        this.boLiVal = res.boLi;
        this.huaHenVal = res.huaHen;
        this.chengKeVal = res.chengKe;
        this.xiuLiChangVal = res.xiulichangType;
        this.xiuLiChangGuochan = res.xiuLiChangGuochan;
        this.xiuLiChangJinkou = res.xiuLiChangJinkou;
      }
    })

  }
  //获取单位个人信息
  getHolderPartytype() {
    this.websize.httpGet("getHolderPartytype", {}).subscribe(res => {
      if (res) {
      }
    })

  }
  //获取跟进人员列表
  getInsureAgentUList() {
    this.websize.httpGet("getInsureAgentUList", {}).subscribe(res => {
      if (res) {
        this.insureAgent = res;
        console.log(res);
      }
    })

  }
  //获取上一年续保信息
  getInsuranceInfo() {
    this.websize.httpPost("getInsuranceInfo", this.params).subscribe(res => {
      if (res) {
        this.lastMsg = res;
        if (res.isForceRenewalDate > 0 || res.isBusinessRenewalDate > 0) {
          this.lastMsg['isRenewalDate'] = false;
        } else {
          this.lastMsg['isRenewalDate'] = true;
        }
        if (res.holderIdCard && res.holderIdCardType) {
          this.lastMsg['infoHolderType'] = 1;
        } else {
          this.lastMsg['infoHolderType'] = 2;
        }
        if (res.insuredIdCard && res.insuredIdCardType) {
          this.lastMsg['infoType'] = 1;
        } else {
          this.lastMsg['infoType'] = 2;
        }
        this.lastMsg['sanZheBaoE'] = res.sanZhe;
        this.lastMsg['siJiBaoE'] = res.siJi;
        this.lastMsg['chengKeBaoE'] = res.chengKe;
        this.lastMsg['boLiBaoE'] = res.boLi;
        this.lastMsg['huahenBaoE'] = res.huaHen;
        this.lastMsg['hcXiuLiCanBaoE'] = res.hcXiulichangType;
        this.lastMsg['hcXiulichangBaoE'] = res.hcXiulichang;
        this.lastMsg['licenseNo'] = res.licenseNo;
        this.lastMsg['carownerName'] = res.carownerName;
        this.lastMsg['carownerCard'] = res.carownerCard;
        this.lastMsg['carownerCardTypeName'] = res.carownerCardTypeName;
        this.lastMsg['carVin'] = res.carVin;
        this.lastMsg['engineNo'] = res.engineNo;
        this.lastMsg['modleName'] = res.modleName;
        this.lastMsg['autoMoldcode'] = res.autoMoldcode;
        this.lastMsg['registerDate'] = res.registerDate;
        this.lastMsg['insuredName'] = res.insuredName;
        this.lastMsg['insuredIdCard'] = res.insuredIdCard;
        this.lastMsg['insuredMobile'] = res.insuredMobile;
        this.lastMsg['nextForceStartdate'] = res.nextForceStartdate;
        this.lastMsg['nextBusinessStartdate'] = res.nextBusinessStartdate;
        if (!res.seatCount) {
          this.lastMsg['seatCount'] = 5;
        } else {
          this.lastMsg['seatCount'] = res.seatCount;
        }

        this.lastMsg['bujimianChesunTag'] = res.bujimianChesun > 0 ? true : false;
        this.lastMsg['bujimianChengkeTag'] = res.bujimianChengke > 0 ? true : false;
        this.lastMsg['bujimianDaoqiangTag'] = res.bujimianDaoqiang > 0 ? true : false;
        this.lastMsg['bujimianHuahenTag '] = res.bujimianHuahen > 0 ? true : false;
        this.lastMsg['bujimianSanzheTag'] = res.bujimianSanzhe > 0 ? true : false;
        this.lastMsg['bujimianSheshuiTag'] = res.bujimianSheshui > 0 ? true : false;
        this.lastMsg['bujimianSijiTag'] = res.bujimianSiji > 0 ? true : false;
        this.lastMsg['bujimianZiranTag'] = res.bujimianZiran > 0 ? true : false;
        this.lastMsg['sheShuiTag'] = res.sheShui > 0 ? true : false;
        this.lastMsg['cheSunTag'] = res.cheSun > 0 ? true : false;
        this.lastMsg['boLiTag'] = res.boLi > 0 ? true : false;
        this.lastMsg['chengKeTag'] = res.chengKe > 0 ? true : false;
        this.lastMsg['daoQiangTag'] = res.daoQiang > 0 ? true : false;
        this.lastMsg['siJiTag'] = res.siJi > 0 ? true : false;
        this.lastMsg['ziRanTag'] = res.ziRan > 0 ? true : false;
        this.lastMsg['sanZheTag'] = res.sanZhe > 0 ? true : false;
        this.lastMsg['huaHenTag'] = res.huaHen > 0 ? true : false;
        this.lastMsg['hcSanfangteyueTag'] = res.hcSanfangteyue > 0 ? true : false;
        this.lastMsg['hcXiulichangTypeTag'] = res.hcXiulichangType > 0 ? true : false;
        this.lastMsg['forceTag'] = true;
        this.lastMsg['memo'] = '';

        this.infoHolderType = res.infoHolderType;
        this.infoType = res.infoType;

      } else {
        this.presentToast("无法读取上一年续保信息,请转人工核保！");

      }
    })
  }
  orderDetail() {
    this.websize.httpPost("qryOrderInfo", { orderId: this.orderId }).subscribe(res => {
      if (res) {
        console.log(res);
        this.lastMsg = res;
        if (res.isForceRenewalDate > 0 || res.isBusinessRenewalDate > 0) {
          this.isRenewalDate = false;
        } else {
          this.isRenewalDate = true;
        };

        if (res.holderIdCard && res.holderIdCardType) {
          this.lastMsg['infoHolderType'] = 1;
        } else {
          this.lastMsg['infoHolderType'] = 2;
        }
        if (res.insuredIdCard && res.insuredIdCardType) {
          this.lastMsg['infoType'] = 1;
        } else {
          this.lastMsg['infoType'] = 2;
        }

        this.lastMsg['sanZheBaoE'] = res.sanZhe;
        this.lastMsg['siJiBaoE'] = res.siJi || 0;
        this.lastMsg['chengKeBaoE'] = res.chengKe || 0;
        this.lastMsg['boLiBaoE'] = res.boLi || 0;
        this.lastMsg['huahenBaoE'] = res.huaHen || 0;
        if (res.hcXiulichangType == null) {
          this.lastMsg['hcXiuLiCanBaoE'] = 0;
        } else {
          this.lastMsg['hcXiuLiCanBaoE'] = res.hcXiulichangType;
        }
        if (res.hcXiulichang == null) {
          this.lastMsg['hcXiulichangBaoE'] = 0;
        } else {
          this.lastMsg['hcXiulichangBaoE'] = res.hcXiulichang;
        }

        // $scope.selectCardName = data.insuredIdCardType;
        this.agentName = res.insureAgentUname;
        this.insureAgentUid = res.insureAgentUid;
        this.params.cityCode = res.cityCode;
        this.lastMsg['licenseNo'] = res.licenseNo;
        this.lastMsg['carownerName'] = res.carownerName;
        this.lastMsg['carownerCard'] = res.carownerCard;
        this.lastMsg['carownerCardTypeName'] = res.carownerCardTypeName;
        this.lastMsg['carVin'] = res.carVin;
        this.lastMsg['engineNo'] = res.engineNo;
        this.lastMsg['modleName'] = res.modleName;
        this.lastMsg['registerDate'] = res.registerDate;
        this.lastMsg['insuredName'] = res.insuredName;
        this.lastMsg['insuredIdCard'] = res.insuredIdCard;
        this.lastMsg['insuredMobile'] = res.insuredMobile;
        this.lastMsg['nextForceStartdate'] = res.forceStartDate;
        this.lastMsg['nextBusinessStartdate'] = res.businessStartDate;
        this.lastMsg['seatCount'] = res.seatCount;
        this.lastMsg['bujimianChesunTag'] = res.bujimianChesun > 0 ? true : false;
        this.lastMsg['bujimianChengkeTag'] = res.bujimianChengke > 0 ? true : false;
        this.lastMsg['bujimianDaoqiangTag'] = res.bujimianDaoqiang > 0 ? true : false;
        this.lastMsg['bujimianHuahenTag'] = res.bujimianHuahen > 0 ? true : false;
        this.lastMsg['bujimianSanzheTag'] = res.bujimianSanzhe > 0 ? true : false;
        this.lastMsg['bujimianSheshuiTag'] = res.bujimianSheshui > 0 ? true : false;
        this.lastMsg['bujimianSijiTag'] = res.bujimianSiji > 0 ? true : false;
        this.lastMsg['bujimianZiranTag'] = res.bujimianZiran > 0 ? true : false;
        this.lastMsg['sheShuiTag'] = res.sheShui > 0 ? true : false;
        this.lastMsg['cheSunTag'] = res.cheSun > 0 ? true : false;
        this.lastMsg['boLiTag'] = res.boLi > 0 ? true : false;
        this.lastMsg['chengKeTag'] = res.chengKe > 0 ? true : false;
        this.lastMsg['daoQiangTag'] = res.daoQiang > 0 ? true : false;
        this.lastMsg['siJiTag'] = res.siJi > 0 ? true : false;
        this.lastMsg['ziRanTag'] = res.ziRan > 0 ? true : false;
        this.lastMsg['sanZheTag'] = res.sanZhe > 0 ? true : false;
        this.lastMsg['huaHenTag'] = res.huaHen > 0 ? true : false;
        this.lastMsg['hcSanfangteyueTag'] = res.hcSanfangteyue > 0 ? true : false;
        // $scope.info.hcXiulichangTag = $scope.info.hcXiulichang > 0 ? true : false;
        this.lastMsg['hcXiulichangTypeTag'] = res.hcXiulichangType > 0 ? true : false;
        this.lastMsg['memo'] = '';

        this.lastMsg['forceTag'] = true;
        this.newselectCardName = 1;
        this.newholderCardName = 1;


      }

    })
  }
  getValues() {
    if (this.lastMsg['isForceRenewalDate'] > 0) {
      if (this.lastMsg['forceTag']) {
        this.forceTag = 1;
      } else {
        this.forceTag = 0;
      };
    } else {
      this.forceTag = 0;
    }

    if (this.lastMsg['cheSunTag']) {
      this.cheSunTag = 1;
    } else {
      this.cheSunTag = 0;
    };
    if (this.lastMsg['bujimianChesunTag']) {
      this.bujimianChesunTag = 1;
    } else {
      this.bujimianChesunTag = 0;
    };
    if (this.lastMsg['sanZheTag']) {
      this.sanZheTag = this.lastMsg['sanZheBaoE'];
    } else {
      this.sanZheTag = 0;
    };
    if (this.lastMsg['bujimianSanzheTag']) {
      this.bujimianSanzheTag = 1;
    } else {
      this.bujimianSanzheTag = 0;
    };
    if (this.lastMsg['daoQiangTag']) {
      this.daoQiangTag = 1;
    } else {
      this.daoQiangTag = 0;
    };
    if (this.lastMsg['bujimianDaoqiangTag']) {
      this.bujimianDaoqiangTag = 1;
    } else {
      this.bujimianDaoqiangTag = 0;
    };
    if (this.lastMsg['siJiTag']) {
      this.siJiTag = this.lastMsg['siJiBaoE'];
    } else {
      this.siJiTag = 0;
    };
    if (this.lastMsg['bujimianSijiTag']) {
      this.bujimianSijiTag = 1;
    } else {
      this.bujimianSijiTag = 0;
    };
    if (this.lastMsg['chengKeTag']) {
      this.chengKeTag = this.lastMsg['chengKeBaoE'];
    } else {
      this.chengKeTag = 0;
    };
    if (this.lastMsg['bujimianChengkeTag']) {
      this.bujimianChengkeTag = 1;
    } else {
      this.bujimianChengkeTag = 0;
    };
    if (this.lastMsg['boLiTag']) {
      this.boLiTag = this.lastMsg['boLiBaoE'];
    } else {
      this.boLiTag = 0;
    };
    if (this.lastMsg['huaHenTag']) {

      this.huaHenTag = this.lastMsg['huahenBaoE'];

    } else {
      this.huaHenTag = 0;
    };
    if (this.lastMsg['bujimianHuahenTag']) {
      this.bujimianHuahenTag = 1;
    } else {
      this.bujimianHuahenTag = 0;
    };
    if (this.lastMsg['sheShuiTag']) {
      this.sheShuiTag = 1;
    } else {
      this.sheShuiTag = 0;
    };
    if (this.lastMsg['bujimianSheshuiTag']) {
      this.bujimianSheshuiTag = 1;
    } else {
      this.bujimianSheshuiTag = 0;
    };
    if (this.lastMsg['ziRanTag']) {
      this.ziRanTag = 1;
    } else {
      this.ziRanTag = 0;
    };
    if (this.lastMsg['bujimianZiranTag']) {
      this.bujimianZiranTag = 1;
    } else {
      this.bujimianZiranTag = 0;
    };
    if (this.lastMsg['hcSanfangteyueTag']) {
      this.hcSanfangteyueTag = 1;
    } else {
      this.hcSanfangteyueTag = 0;
    };

    if (this.lastMsg['hcXiuLiCanBaoE'] > 0) {
      this.hcXiulichangTypeTag = this.lastMsg['hcXiuLiCanBaoE'];
      this.hcXiulichangTag = this.lastMsg['hcXiulichangBaoE'];
    } else {
      this.hcXiulichangTypeTag = 0;
      this.hcXiulichangTag = 0;
    };
    if (this.lastMsg['seatCount']) {
      this.lastMsg['seatCount'] = this.lastMsg['seatCount'];
    } else {
      this.lastMsg['seatCount'] = '';
    }
  }


  changeSelect(info, key1, key2, valBaoE) {
    if (key2 == 'cheSunTag') {
      if (this.lastMsg['cheSunTag']) {
        this.lastMsg['hcSanfangteyueTag'] = true;
      } else {
        this.lastMsg['hcSanfangteyueTag'] = false;
      }
    }
    info[key1] = info[key2];
    if (info[key2]) {
      this.lastMsg[valBaoE] = this.valmap[key2];
    } else {
      this.lastMsg[valBaoE] = 0;
    }

  }
  changeUnCheck(key1, key2, valBaoE) {
    if (this.lastMsg[valBaoE] > 0) {
      this.lastMsg[key1] = true;
      this.lastMsg[key2] = true;
    } else {
      this.lastMsg[key1] = false;
      this.lastMsg[key2] = false;

    }
  }
  changeCheck() {
    if (this.lastMsg['hcXiuLiCanBaoE'] > 0) {
      this.lastMsg['hcXiulichangTypeTag'] = true;
      this.lastMsg['hcXiulichangBaoE'] = 0.1;
    } else {
      this.lastMsg['hcXiulichangTypeTag'] = false;
      this.lastMsg['hcXiulichangBaoE'] = 0;
    }

  };
  changeSelect0(info, key1, key2, valBaoE) {
    info[key1] = info[key2];
    if (this.lastMsg['chengKeTag'] == true) {
      this.lastMsg['seatCount'] = 5;
    } else {
      this.lastMsg['seatCount'] = "";
    }
    if (info[key2]) {
      this.lastMsg[valBaoE] = this.valmap[key2];
    } else {
      this.lastMsg[valBaoE] = 0;
    }
  };
  changeSelect1(info, key1, key2, valBaoE, hcXiulichangBaoE) {
    info[key1] = info[key2];
    if (info[key2]) {
      this.lastMsg[valBaoE] = this.valmap[key2];
      this.lastMsg[hcXiulichangBaoE] = this.valmap[key1];
    } else {
      this.lastMsg[valBaoE] = 0;
      this.lastMsg[hcXiulichangBaoE] = 0;
    }
  };



  //自动下一步
  nextBtn() {

    this.getValues();
    let paramsList = {
      cityCode: this.params.cityCode,
      insureAgentUid: this.insureAgentUid,
      insureAgentUname: this.agentName,
      licenseNo: this.params.licenseNo,
      carownerName: this.lastMsg['carownerName'],
      carownerCard: this.lastMsg['carownerCard'],
      carVin: this.lastMsg['carVin'],
      engineNo: this.lastMsg['engineNo'],
      modleName: this.lastMsg['modleName'],
      registerDate: this.lastMsg['registerDate'],
      holderPartytype: '',
      holderName: this.lastMsg['holderName'],
      holderIdCard: this.lastMsg['holderIdCard'],
      holderMobile: this.lastMsg['holderMobile'],
      holderIdCardType: this.lastMsg['holderIdCardType'],
      insuredName: this.lastMsg['insuredName'],
      insuredIdCard: this.lastMsg['insuredIdCard'],
      insuredMobile: this.lastMsg['insuredMobile'],
      insuredIdCardType: this.lastMsg['insuredIdCardType'],
      forceStartDate: this.lastMsg['nextForceStartdate'],
      businessStartDate: this.lastMsg['nextBusinessStartdate'],
      seatCount: this.lastMsg['seatCount'],
      force: this.forceTag,
      cheSun: this.cheSunTag,
      bujimianChesun: this.bujimianChesunTag,
      sanZhe: this.sanZheTag,
      bujimianSanzhe: this.bujimianSanzheTag,
      daoQiang: this.daoQiangTag,
      bujimianDaoqiang: this.bujimianDaoqiangTag,
      siJi: this.siJiTag,
      bujimianSiji: this.bujimianSijiTag,
      chengKe: this.chengKeTag,
      bujimianChengke: this.bujimianChengkeTag,
      boLi: this.boLiTag,
      huaHen: this.huaHenTag,
      bujimianHuahen: this.bujimianHuahenTag,
      sheShui: this.sheShuiTag,
      bujimianSheshui: this.bujimianSheshuiTag,
      ziRan: this.ziRanTag,
      bujimianZiran: this.bujimianZiranTag,
      hcSanfangteyue: this.hcSanfangteyueTag,
      hcXiulichangType: this.hcXiulichangTypeTag,
      hcXiulichang: this.hcXiulichangTag,
      memo: this.lastMsg['memo'] || '',
      autoMoldcode: '',
      purchasePrice: '',
      exhaustScale: '',

    };

    if (this.lastMsg['infoHolderType'] == 2) {
      paramsList.holderName = this.lastMsg['newholderName'] || '';
      paramsList.holderIdCard = this.lastMsg['newholderIdCard'] || '';
      paramsList.holderMobile = this.lastMsg['newholderMobile'] || '';
      paramsList.holderIdCardType = this.newholderCardName || '';
    } else { //取上一年信息
      paramsList.holderName = this.lastMsg['holderName'] || '';
      paramsList.holderIdCard = this.lastMsg['holderIdCard'] || '';
      paramsList.holderMobile = this.lastMsg['holderMobile'] || '';
      paramsList.holderIdCardType = this.lastMsg['holderIdCardType'] || '';
    }

    if (this.lastMsg['infoType'] == 2) {
      paramsList.insuredName = this.lastMsg['newinsuredName'] || '';
      paramsList.insuredIdCard = this.lastMsg['newinsuredIdCard'] || '';
      paramsList.insuredMobile = this.lastMsg['newinsuredMobile'] || '';
      paramsList.insuredIdCardType = this.newselectCardName || '';
    } else { //取上一年信息
      paramsList.insuredName = this.lastMsg['insuredName'] || '';
      paramsList.insuredIdCard = this.lastMsg['insuredIdCard'] || '';
      paramsList.insuredMobile = this.lastMsg['insuredMobile'] || '';
      paramsList.insuredIdCardType = this.lastMsg['insuredIdCardType'] || '';
    }
    //更换车型
    if (this.lastMsg['autoMoldcode'] && this.lastMsg['vehicleTags']) {
      paramsList.autoMoldcode = this.lastMsg['autoMoldcode'] || '';
      paramsList.purchasePrice = this.lastMsg['purchasePrice'] || '';
      paramsList.exhaustScale = this.lastMsg['exhaustScale'] || '';
    }
    this.carOrArtificial['list'] = paramsList;
    this.carOrArtificial['router'] = this.router;



    if (!this.forceTag && !this.cheSunTag && !this.sanZheTag && !this.daoQiangTag && !this.siJiTag && !this.chengKeTag && !this.boLiTag && !this.huaHenTag && !this.sheShuiTag && !this.ziRanTag && !this.hcSanfangteyueTag && !this.hcXiulichangTypeTag) {
      this.presentToast('请至少选择一种险种！');
      return false;
    } else {
      if (this.forceTag) {
        if (!this.lastMsg['nextForceStartdate']) {
          this.presentToast('请选择交险起保时间！');
          return false;
        } else {
          if (!this.cheSunTag && !this.sanZheTag && !this.daoQiangTag && !this.siJiTag && !this.chengKeTag && !this.boLiTag && !this.huaHenTag && !this.sheShuiTag && !this.ziRanTag && !this.hcSanfangteyueTag && !this.hcXiulichangTypeTag) {
            this.goNext();
            return false;
          } else {
            if (!this.lastMsg['nextBusinessStartdate']) {
              this.presentToast('请选择商业险起保时间！');
              return false;
            } else {
              this.goNext();
              return false;
            }
          }
        }
      } else if (this.cheSunTag || this.sanZheTag || this.daoQiangTag || this.siJiTag || this.chengKeTag || this.boLiTag || this.huaHenTag || this.sheShuiTag || this.ziRanTag || this.hcSanfangteyueTag || this.hcXiulichangTypeTag) {
        if (!this.lastMsg['nextBusinessStartdate']) {
          this.presentToast('请选择商业险起保时间！');
          return false;
        } else {
          if (this.forceTag) {
            if (!this.lastMsg['nextForceStartdate']) {
              this.presentToast('请选择交强险起保时间！');
              return false;
            } else {
              this.goNext();
              return false;
            }
          } else {
            this.goNext();
            return false;
          }
        }
      }

    }

  }
  goNext() {

    if (this.carOrArtificial['list'].insuredName == '') {
      this.presentToast('请填写被保人姓名！');
      return false;
    }
    if (this.carOrArtificial['list'].insuredIdCardType == 1) {
      if (!this.csNav.isCardID(this.carOrArtificial['list'].insuredIdCard)) {
        this.presentToast('被保人证件号码格式不正确！');
        return false;
      }
    } else {
      if (this.carOrArtificial['list'].insuredIdCard == '') {
        this.presentToast('请填写被保人证件号码！');
        return false;
      }
    }

    if (this.carOrArtificial['list'].holderName == '') {
      this.presentToast('请填写投保人姓名！');
      return false;
    }
    if (this.carOrArtificial['list'].holderIdCardType == 1) {
      if (!this.csNav.isCardID(this.carOrArtificial['list'].holderIdCard)) {
        this.presentToast('投保人证件号码格式不正确！');
        return false;
      }
    } else {
      if (this.carOrArtificial['list'].holderIdCard == '') {
        this.presentToast('请填写投保人证件号码！');
        return false;
      }
    }
    if (this.chengKeTag) {
      if (this.lastMsg['seatCount'] == "" || this.lastMsg['seatCount'] == 0) {
        this.presentToast('请填写座位数！');
        return false;
      }
    }
    this.navCtrl.push(SelInsuranceCompPage, { carOrArtificial: this.carOrArtificial, selInsCompType: 2 });

  }
  //人工核保
  manualCheck() {
    if (this.router == 1) {//待核保/重新报价/险种选择

      this.navCtrl.push(SelInsuranceCompPage, { 'selInsCompType': 2 });
    } else if (this.router == 2) {//待核保/修改保单/险种选择
      this.navCtrl.push(SelInsuranceCompPage, { 'selInsCompType': 1 });
    } else {//待支付/重新报价/险种选择
      this.navCtrl.push(SelInsuranceCompPage, { 'selInsCompType': 3 });
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
  showMessagess() {
    if (this.infoType == 2) {
      this.lastMsg['newinsuredName'] = "";
      this.newselectCardName = 1;
      this.lastMsg['newinsuredIdCard'] = "";
      this.lastMsg['newinsuredMobile'] = "";
    }
    if (this.infoHolderType == 2) {
      this.lastMsg['newholderName'] = "";
      this.newholderCardName = 1;
      this.lastMsg['newholderIdCard'] = "";
      this.lastMsg['newholderMobile'] = "";
    }

  }
}