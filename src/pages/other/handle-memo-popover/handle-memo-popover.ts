import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


/**
 * Generated class for the AgentPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'handle-memo-popover',
  templateUrl: 'handle-memo-popover.html'
})
export class handleMemoPopoverComponent {

  remarks: string = "";

  constructor(public viewCtrl: ViewController) {

  }

  close(type) {
    if (type)
      this.viewCtrl.dismiss(this.remarks);
    else
      this.viewCtrl.dismiss();
  }



}
