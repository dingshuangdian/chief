import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { NavController, Events, Tabs, App, Platform } from 'ionic-angular';

import { HomePage } from '../home/home';
import { AccountPage } from '../account/account';
// import { IdOrcPage } from '../id-orc/id-orc';
import { OrderPage } from '../order/order';
import { StatementPage } from '../statement/statement';

import { WebSites } from '../../providers/web-sites'
import { receiveCarPage } from '../home/receive-car/receive-car';
import { pickupCarPage } from '../home/receive-car/pickup-car/pickup-car';
import { CsbzNave } from '../../providers/csbz-nave';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { resourcesStaticProvider } from '../../providers/resources-static';
import { timeout } from 'rxjs/operators';
import { LoginPage } from '../login/login';
import { BackButtonService } from '../../providers/backButton';
/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  homeRoot = HomePage
  orderRoot = OrderPage
  // idOrcRoot = IdOrcPage
  statementRoot = StatementPage
  accountRoot = AccountPage

  oldSelect: number = 0;

  constructor(public navCtrl: NavController, public Websites: WebSites, public elementRef: ElementRef,
    public renderer: Renderer, public event: Events,
    public csNave: CsbzNave,
    public appCtrl: App,
    public platform: Platform,
    public backButtonService: BackButtonService,
    public RSData: resourcesStaticProvider) {
    platform.ready().then(() => {
      backButtonService.registerBackButtonAction(this.tabRef);
    });

  }
  ionViewDidLoad() {

    //this.appCtrl.getRootNav().setRoot(LoginPage);
    // let tabs = this.queryElement(this.elementRef.nativeElement, '.tabbar');
    // this.event.subscribe('hideTabs', () => {
    //   this.renderer.setElementStyle(tabs, 'display', 'none');
    //   let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
    //   let content = this.queryElement(SelectTab, '.scroll-content');
    //   this.mb = content.style['margin-bottom'];
    //   this.renderer.setElementStyle(content, 'margin-bottom', '0')
    // });
    // this.event.subscribe('showTabs', () => {
    //   this.renderer.setElementStyle(tabs, 'display', '');
    //   let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
    //   let content = this.queryElement(SelectTab, '.scroll-content');
    //   this.renderer.setElementStyle(content, 'margin-bottom', this.mb)
    // })
  }
  // queryElement(elem: HTMLElement, q: string): HTMLElement {
  //   return <HTMLElement>elem.querySelector(q);
  // }
  onScanCarId() {
    this.RSData.JdPCode("202003", "2", "202004").then((msg) => {
      this.tabRef.select(0);
      // this.navCtrl.push(receiveCarPage, { "home": true });
      // this.navCtrl.push(pickupCarPage);
      this.csNave.carIdSacn((id) => {
        this.navCtrl.push(pickupCarPage, { "id": id });
      })

    }, (msg) => { })
  }
  changeTabs() {
    if (this.tabRef.getIndex(this.tabRef.getSelected()) == 0) {
      return;
    } else if (this.tabRef.getIndex(this.tabRef.getSelected()) == 1) {
      // this.RSData.JdPCode("orderListMenu").then((msg) => {
      //   this.oldSelect = this.tabRef.getIndex(this.tabRef.getSelected());
      // }, (msg) => {
      //   this.tabRef.select(this.oldSelect);
      // })
    } else if (this.tabRef.getIndex(this.tabRef.getSelected()) == 3) {
      // this.RSData.JdPCode("statTradeReportListMenu").then((msg) => {
      //   this.oldSelect = this.tabRef.getIndex(this.tabRef.getSelected());
      // }, (msg) => {
      //   this.tabRef.select(this.oldSelect);
      // })
    }
    // this.tabRef.select(this.oldSelect);
    // this.oldSelect = this.tabRef.getIndex(this.tabRef.getSelected());
  }
}
