import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


/**
 * Generated class for the AgentPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-memo-popover',
  templateUrl: 'add-memo-popover.html'
})
export class addMemoPopoverComponent {

  memoContent: string = "";

  constructor(public viewCtrl: ViewController) {

  }

  close(type) {
    if (type)
      this.viewCtrl.dismiss(this.memoContent);
    else
      this.viewCtrl.dismiss();
  }



}
