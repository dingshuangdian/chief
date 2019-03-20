import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'toast-project-popover',
  templateUrl: 'toast-project-popover.html'
})
export class toastProjectPopoverComponent {

  checkProject: boolean = true;

  msg: string;
  count4Order;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.msg = this.navParams.get("msg");
    this.count4Order = this.navParams.get("count4Order");
  }

  close(type) {
    if (type) {
      this.viewCtrl.dismiss(this.checkProject);
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
