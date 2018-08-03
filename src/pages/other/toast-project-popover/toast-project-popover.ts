import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


@Component({
  selector: 'toast-project-popover',
  templateUrl: 'toast-project-popover.html'
})
export class toastProjectPopoverComponent {

  checkProject: boolean = true;

  msg: string;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.msg = this.navParams.get("msg");
  }

  close(type) {
    if (type) {
      this.viewCtrl.dismiss(this.checkProject);
    } else {
      this.viewCtrl.dismiss();
    }
  }
}
