import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';
import { WebSites } from '../../../../../providers/web-sites';
import { addMemoPopoverComponent } from '../../../../other/add-memo-popover/add-memo-popover';
import { handleMemoPopoverComponent } from '../../../../other/handle-memo-popover/handle-memo-popover';
import { updateMemoPopoverComponent } from '../../../../other/update-memo-popover/update-memo-popover';


@Component({
  selector: 'page-memo-record',
  templateUrl: 'memo-record.html',
})
export class memoRecordPage {

  customer: any = { memberId: '', memberName: '', mobileNumber: '', autoId: "", plateNumber: "" };

  memoList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public Websites: WebSites, public popoverCtrl: PopoverController, ) {
    this.customer = this.navParams.get("customer");
  }

  ionViewDidLoad() {
    this.findAutoMemosByAutoId();
  }

  findAutoMemosByAutoId() {
    this.Websites.httpPost('findAutoMemosByAutoId', { autoId: this.customer.autoId }).subscribe(res => {
      console.log(res);
      if (res) {
        this.memoList = res;
      }

    })
  }

  addAutoMemo(addAutoMemo) {
    this.Websites.httpPost('addAutoMemo', { autoId: this.customer.autoId, autoMemo: addAutoMemo }).subscribe(res => {
      console.log(res);
      this.findAutoMemosByAutoId();
    })
  }

  updateAutoHandleResult(m, handleResult) {
    this.Websites.httpPost("updateAutoHandleResult", { handleResult: handleResult, memoId: m.memoId }).subscribe(res => {
      console.log(res);
      this.findAutoMemosByAutoId();
    })
  }

  updateAutoMemo(m, autoMemo) {
    this.Websites.httpPost("updateAutoMemo", { autoMemo: autoMemo, memoId: m.memoId }).subscribe(res => {
      console.log(res);
      this.findAutoMemosByAutoId();
    })
  }


  add() {
    let popover = this.popoverCtrl.create(addMemoPopoverComponent, {}, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (typeof data == "string" && data.length > 0) {
        this.addAutoMemo(data);
      }
    });
    popover.present();

  }

  handle(m) {
    let popover = this.popoverCtrl.create(handleMemoPopoverComponent, {}, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (typeof data == "string") {
        this.updateAutoHandleResult(m, data);
      }
    });
    popover.present();
  }

  modify(m) {
    let popover = this.popoverCtrl.create(updateMemoPopoverComponent, { memo: m }, { cssClass: "addProjectPopover" });
    popover.onDidDismiss(data => {
      if (typeof data == "string") {
        this.updateAutoMemo(m, data);
      }
    });
    popover.present();
  }

}


