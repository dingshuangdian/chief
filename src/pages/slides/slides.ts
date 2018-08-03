import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {
    window.localStorage.setItem("toIntro", "y");
  }
  ionViewDidLoad() {
  }
  startApp() {
    this.navCtrl.setRoot(LoginPage);
  }
  
}
