import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';


/**
 * Generated class for the AgentPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'update-memo-popover',
  templateUrl: 'update-memo-popover.html'
})
export class updateMemoPopoverComponent {

  memoContent: string = "";

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    let memo = this.navParams.get("memo");
    this.memoContent = memo.autoMemo;
  }

  close(type) {
    if (type)
      this.viewCtrl.dismiss(this.memoContent);
    else
      this.viewCtrl.dismiss();
  }



}
