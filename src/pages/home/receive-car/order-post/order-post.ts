import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, Events, ViewController, Tabs, App} from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';
import { CsbzNave } from '../../../../providers/csbz-nave';
import { OrderPage } from '../../../order/order';
import { receiveCarPage } from '../receive-car';





/**
 * Generated class for the receiveCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


declare let cordova: any;
@Component({
 
  selector: 'page-order-post',
  templateUrl: 'order-post.html',
})
export class orderPostPage {
  autoId: string;
  orderId: string;
  pickupMileage: string;

  sourceView: ViewController;

  @ViewChild(Navbar) navBar: Navbar;

  auto: any = { plateNumber: "", biEdate: "", currentMileage: "", vinCode: "", engineNo: "", autoMemo: "", auditDate: "" }

  constructor(public navCtrl: NavController, public navParams: NavParams, public webSites: WebSites, public csbzNave: CsbzNave, public events: Events,private app:App) {
    this.orderId = this.navParams.get("orderId");
    this.autoId = this.navParams.get("autoId");
    this.pickupMileage = this.navParams.get('pickupMileage');

    this.events.publish('appointment:refresh');
  }

  ionViewDidLoad() {
    //this.navBar.backButtonClick = this.backButtonClick;

    let allView = this.navCtrl.getViews();

    // if (allView.length && allView.length == 4) {
    //   this.sourceView = 'receiveCarPage';
    //   this.navCtrl.remove(1, 2);
    // }

    allView.forEach(element => {
      if (element.component == receiveCarPage) {
        this.sourceView = element;
      }
    });



    if (allView.length && allView.length == 2) {
      // this.sourceView = 'orderEditPage';
    }
    this.findAutoByAutoId();
  }

  // backButtonClick = (e: UIEvent) => {
  //   if (this.sourceView.component == receiveCarPage) {
  //     this.navCtrl.popTo(this.sourceView);
  //   } else {
  //     this.csbzNave.closewin();

  //   }
  // }

  findAutoByAutoId() {
    this.webSites.httpPost('findAutoByAutoId', { autoId: this.autoId }, true, true, true).subscribe(res => {
      this.auto = res;
    });
  }

  saveCarInfo() {
    let parmas = this.auto;
    parmas['currentMileage'] = this.pickupMileage;
    this.webSites.httpPost('updateAutoInfo', parmas).subscribe(res => {
      this.goOrderList();
    });
  }

  goInsurance() {
    cordova.BSTool.pushBSView({ "lgiName": "chepu123", "lgiPwd": "chepu123", "firstType": 1, "carNum": this.auto.plateNumber }, (res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    })
  }
  goBack() {
    if (this.sourceView &&  this.sourceView.component == receiveCarPage) {
      this.navCtrl.popTo(this.sourceView);
    } else {
      //window.location.href = WebConfig.server_ + "/www/index.html#/receiveCar/0"
      this.navCtrl.popToRoot();
      this.navCtrl.parent.select(0);
      this.app.getRootNav().push(receiveCarPage);

    }
   
  }

  goOrderList() {
    //   if (this.sourceView.component == receiveCarPage) {
    //     // window.location.href = WebConfig.server_ + "/czbbb/order/orderListView.jsp#panel-1"
    //     this.navCtrl.push(OrderPage);
    //   } else {
    //     this.csbzNave.closewin();
    //   }
    
    this.navCtrl.popToRoot();
    this.navCtrl.parent.select(1);
    //this.tabRef.select(1);
  }

}
