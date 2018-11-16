import { Component } from '@angular/core';
import { NavController, ViewController, App, Events, Platform  } from 'ionic-angular';
import { WebSites } from '../../providers/web-sites'
import { BackButtonService } from '../../providers/backButton';

import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';
import { WebConfig } from '../../providers/web-config';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: any = { lgiName: '', lgiPwd: '' };

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public Websites: WebSites,
    public appCtrl: App,
    public userData: UserData, 
    public event: Events,
    private platform: Platform,
    private backButtonService: BackButtonService,
  ) {
    platform.ready().then(() => {
      backButtonService.registerBackButtonAction(null);
    });
  }
  ionViewDidLoad() {
  }
  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  onLogin() {
    this.userData.onLogin(this.login.lgiName, this.login.lgiPwd, () => {
      let rootNav = this.appCtrl.getRootNav();
      if (rootNav.root === TabsPage) {
        this.viewCtrl.dismiss();
      } else {
        this.navCtrl.setRoot(TabsPage);
      }
    });

  };

  kefu() {
    window.open('tel:' + WebConfig.phone);
  }

}
