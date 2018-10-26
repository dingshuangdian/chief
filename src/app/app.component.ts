import { Component, ViewChild } from '@angular/core';
import { Events, Platform, ModalController, App, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserData } from '../providers/user-data'
import { CsbzNave } from '../providers/csbz-nave';
import { SlidesPage } from '../pages/slides/slides';
import { JPush } from '@jiguang-ionic/jpush';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  modal: any;
  isIos = false;
  constructor(
    public events: Events,
    public UserData: UserData,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public modalCtrl: ModalController,
    public userData: UserData,
    public csbzNave: CsbzNave,
    private keyboard: Keyboard,
    public appCtrl: App,
    public jpush: JPush,
  ) {

    platform.ready().then(() => {
      statusBar.styleLightContent();
      splashScreen.hide();
      this.keyboard.disableScroll(false);
      //this.csbzNave.pushInit();
      //this.csbzNave.appUpdate();
      jpush.init();
      jpush.setDebugMode(true);
    });
    if (window.localStorage.getItem("toIntro") === null) {
      this.rootPage = SlidesPage;
    } else if (this.userData.getToken()) {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = LoginPage;
    }
    this.listenToLoginEvents();

    // if (platform.is('ios')) {
    //   this.isIos = true;
    // }
    //this.rootPage = TabsPage;

    // this.modal = this.modalCtrl.create(LoginPage);

    // this.modal.onWillDismiss((data: any[]) => {
    //   if (data) {
    //     console.log(data);
    //   }
    // });
  }
  listenToLoginEvents() {
    this.events.subscribe('user:logout', () => {
      this.userData.logout();
      // this.modal.present();
      this.appCtrl.getRootNav().root = LoginPage;
    });
  }
}

