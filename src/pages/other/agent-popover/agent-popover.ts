import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


/**
 * Generated class for the AgentPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'agent-popover',
  templateUrl: 'agent-popover.html'
})
export class AgentPopoverComponent {

  sendInfor: any = { sendUname: '', sendMobile: '' };

  constructor(public viewCtrl: ViewController) {

  }

  close(type) {
    if (type)
      this.viewCtrl.dismiss(this.sendInfor);
    else
      this.viewCtrl.dismiss();
  }



}
