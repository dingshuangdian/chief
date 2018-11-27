import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AgentlistPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-agentlist-popover',
  templateUrl: 'agentlist-popover.html',
})
export class AgentlistPopoverPage {

  @Input() insureAgent: any;
  @Input() insureAgentUid: any;
  @Output() selectEvent = new EventEmitter<any>();

  isItem;//选择的对象

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  ionViewDidLoad() {
  }

  //确定
  doSure(){
    this.selectEvent.emit(this.isItem);
  }
}
