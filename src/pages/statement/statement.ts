import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, Events } from 'ionic-angular';
import { CommissionCountPage } from './commission-count/commission-count';
import { IncomeCountPage } from './income-count/income-count';
import { IncomeGatherPage } from './income-gather/income-gather';


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

  @ViewChild('stateTabs') tabRef: Tabs;

  tab1Root = IncomeGatherPage;
  tab2Root = IncomeCountPage;
  tab3Root = CommissionCountPage;


  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    this.tabSelect()
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
    }
  }

}
