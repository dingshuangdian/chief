import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { CsModal } from '../../../providers/cs-modal';
import { ProvincesPage } from '../../other/provinces/provinces';
import { WebSites } from '../../../providers/web-sites';
import { cityPopover } from '../../other/city-popover/city-popover';
import { AllInsurancePage } from './all-insurance/all-insurance';
import { ExceptionCausePage } from './exception-cause/exception-cause';
import { MsgInsurancePage } from './msg-insurance/msg-insurance';
import { CsbzNave } from '../../../providers/csbz-nave';
import { RequotationPage } from './requotation/requotation';
import { CarInsProgressPage } from '../auto-insurance/car-ins-progress/car-ins-progress';
import { ModifyPolicyPage } from '../auto-insurance/modify-policy/modify-policy';
/**
 * Generated class for the AutoInsurancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-auto-insurance',
  templateUrl: 'auto-insurance.html',
})
export class AutoInsurancePage {
  cxData = [];

  licenseplateShort = [];//车牌简称列表
  selectedLicense;//车牌简称
  defaultCity;//投保地区
  cityList;//投保地区选择列表
  cityCode;//投保地区code
  licenseNo;//车牌号
  platmNum;//搜索车牌关键字
  msg = false;//是否有新消息
  currentDate;//今天日期
  cucumber: boolean = true;//免责条款复选框
  userId;//用户id
  agentName;//agentName

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private csModal: CsModal,
    private websize: WebSites,
    public popoverCtrl: PopoverController,
    private csbzNave: CsbzNave,
    private toastCtrl: ToastController,
  ) {
    if (this.navParams.get("carNum")) {
      this.selectedLicense = this.navParams.get("carNum").substring(0, 1);
      this.platmNum = this.navParams.get("carNum").substring(1);
    }
    this.currentDate = this.getNowFormatDate();
  }

  // 下一步
  nextOperation() {
    let CarNo = this.csbzNave.checkCarNo(this.selectedLicense + this.platmNum);
    if (!CarNo) {
      this.presentToast('请输入正确的车牌号，如粤A88888');
      return;
    }
    this.licenseNo = this.selectedLicense + this.platmNum.toUpperCase();
    if (!this.defaultCity) {
      this.presentToast('请选择投保地区');
      return;
    }
    if (!this.cucumber) {
      this.presentToast("请勾选《免责条款》")
      return;
    }
    this.navCtrl.push(RequotationPage, { licenseNo: this.licenseNo, cityCode: this.cityCode, userId: this.userId, agentName: this.agentName, requotationType: 1 })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  ionViewDidLoad() {
    this.init();
    //this.getDefaultcity();

  }
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate;
  }

  //获取用户信息
  init() {
    this.websize.httpPost('getInfo', {})
      .subscribe(
        res => {
          this.agentName = res.userName;
          this.userId = res.userId;
          localStorage.setItem('storeInfo', JSON.stringify(res));

          this.getcxData();
          this.getcxCity();
          this.getLicenseplateShort();
          this.getUnReadMsg();
        }, err => {

        }
      );
  }

  // 获取到期车险列表
  getcxData() {
    this.websize.httpGet('getExpireInsuranceList', {}, true).subscribe(res => {
      if (res) {
        this.cxData = res.rows;
      }
    })
  }

  // 获取城市列表
  getcxCity() {
    this.websize.httpGet('getCityList', {}).subscribe(res => {
      if (res) {
        this.cityList = res;
        this.defaultCity = res[0].cityName;
        this.cityCode = res[0].cityCode;
        res.forEach(element => {
          if (element.isDefault == 1) {
            this.defaultCity = element.cityName;
            this.cityCode = element.cityCode;
            return;
          }
        });
      }
    })
  }

  //获取未读消息
  getUnReadMsg() {
    this.websize.httpGet('queryUnreadMsg', {}).subscribe(res => {
      if (res) {
        this.msg = res.unreadMsg > 0 ? true : false;
      }
    })
  }

  //获取车牌简称
  getLicenseplateShort() {
    this.websize.httpGet('getLicenseplateShort', {}).subscribe(res => {
      if (res) {
        res.forEach(element => {
          if (element.isDefault == 1) {
            this.selectedLicense = this.selectedLicense || element.aliasName;

          }
          this.licenseplateShort.push(element.aliasName)
        });

      }
    })
  }

  //获取默认城市
  getDefaultcity() {
    this.websize.httpGet('setDefaultAddress', {}).subscribe(res => {
      if (res) {
        //this.defaultCity = res;
      }

    })
  }

  //选城市
  SelectCity() {
    let popover = this.popoverCtrl.create(cityPopover, { t: this.cityList }, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (data) {
        this.defaultCity = data.cityName;
        this.cityCode = data.cityCode;
      }
    });
    popover.present();
  }

  //选省份
  showProvince() {
    this.csModal.showProvince(ProvincesPage, { provinces: this.licenseplateShort }, (data) => {
      this.selectedLicense = data;
    });
  }

  //车险进度
  goCarInsProg() {
    this.navCtrl.push(CarInsProgressPage);
  }

  //查看全部到期车辆
  toALList() {
    this.navCtrl.push(AllInsurancePage);
  }

  //《免责条款》
  tomz() {
    this.navCtrl.push(ExceptionCausePage);
  }

  //新信息
  tomsg() {
    this.navCtrl.push(MsgInsurancePage);
  }

  //过户车等转人工报价
  toQuotedPrice() {
    this.navCtrl.push(ModifyPolicyPage, {
      cityCode: this.cityCode,
      agentName: this.agentName,
      userId: this.userId
    });
  }

  // 车险到期提醒点击跳转
  goSelectSurrence(cityCode,licenseNo){
    this.navCtrl.push(RequotationPage, {
      'licenseNo': licenseNo,
      'cityCode': cityCode,
      'agentName': this.agentName,
      'userId': this.userId,
      'requotationType': 1
  });
  }

}
