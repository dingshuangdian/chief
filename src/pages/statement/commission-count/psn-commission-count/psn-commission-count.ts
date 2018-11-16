import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PsnCommissionCountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-psn-commission-count',
  templateUrl: 'psn-commission-count.html',
})
export class PsnCommissionCountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    let elements = document.querySelectorAll(".hideTabsTag");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        let childNodes = elements[key].childNodes;
        childNodes.forEach(c => {
          console.log(c);
          if (c.localName === "ion-fab" || c.localName === "div") {
            c.style.display = 'none';
          }
        });
      });
    }
  }

  ionViewWillLeave() {
    let elements = document.querySelectorAll(".hideTabsTag");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        // elements[key].style.display ='flex';
        let childNodes = elements[key].childNodes;
        childNodes.forEach(c => {
          console.log(c);
          if (c.localName === "ion-fab" || c.localName === "div") {
            c.style.display = 'flex';
          }
        });
      });
    }
  }
  changeClassic() {

  }
  changeCheckTC() { 
    
  }

}
