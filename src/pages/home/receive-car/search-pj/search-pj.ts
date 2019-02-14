import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { WebSites } from '../../../../providers/web-sites';
import { carEditPjPage } from '../car-edit-pj/car-edit-pj';
import { ElementDef } from '@angular/core/src/view';

@Component({
  selector: 'page-search-pj',
  templateUrl: 'search-pj.html',
})
export class searchPjPage {
  @ViewChild('searchbar') searchbar;
  seachInfo: any = { keyWords: '', page: '', rows: 20 };
  customers = [];
  callback;
  addpro;
  flag = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private alertCtrl: AlertController, private websites: WebSites, private changeDetectorRef: ChangeDetectorRef) {
    this.callback = this.navParams.get('callback');
    this.addpro = this.navParams.get('addpro');
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();//为输入框设置焦点
    },150);
  }
  ionViewDidLoad() {
  }
  searchPj(key) {
    if (key) {
      this.seachInfo.keyWords = key;
    }

    this.websites.httpPost('findGoods4keyWords', this.seachInfo).subscribe(res => {
      this.customers = res ? res : [];
      this.changeDetectorRef.detectChanges();
    })
  }
  hyselectItem(j) {

    this.navCtrl.push(carEditPjPage, { callback: this.callback, j: j, addpro: this.addpro, flag: this.flag });
  }
}




