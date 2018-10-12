import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, Events, ViewController } from 'ionic-angular';
import { CommissionCountPage } from './commission-count/commission-count';
import { IncomeCountPage } from './income-count/income-count';
import { NopromittPage } from './nopromitt/nopromitt';
import { IncomeGatherPage } from './income-gather/income-gather';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the StatementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-statement',
  templateUrl: 'statement.html',
})
export class StatementPage {
  showYs: boolean = false;
  showSz: boolean = false;
  showTc: boolean = false;
  permissionData = [];
  @ViewChild('stateTabs') tabRef: Tabs;
  tab1Root = IncomeGatherPage;
  tab2Root = IncomeCountPage;
  tab3Root = CommissionCountPage;
  tab4Root = NopromittPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public storage: Storage,public ViewController:ViewController) {
    this.permissionData = JSON.parse(window.localStorage.getItem('permissionData'));
    this.permissionData.forEach(element => {
      if (element.menuId == "202006") {
        if ((element.funcTags & 1) == 1) {
          this.showYs = true;
        } else {
          this.showYs = false;
        }
      }
      if (element.menuId == "208003") {
        if ((element.funcTags & 1) == 1) {
          this.showSz = true;
        } else {
          this.showSz = false;
        }
      }
      if (element.menuId == "206003") {
        if ((element.funcTags & 1) == 1) {
          this.showTc = true;
        } else {
          this.showTc = false;
        }
      }
    })
  }
  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.tabSelect();
  }
  tabSelect() {
    let tab = this.tabRef.getSelected() || { tabTitle: "" }
    switch (tab.tabTitle) {
      case '营收汇总':
        this.events.publish('stateTabs:IncomeGatherPage');
        break;
      case '收支统计':
        this.events.publish('stateTabs:IncomeCountPage');
        break;
      case '提成统计':
        this.events.publish('stateTabs:CommissionCountPage');
        break;
      case '禁止访问':
        this.events.publish('stateTabs:NopromittPage');
        break;
    }
  }
}
