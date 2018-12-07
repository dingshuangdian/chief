import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { WebSites } from '../../../../providers/web-sites';
import { carEditPjPage } from '../car-edit-pj/car-edit-pj';
import { searchPjPage } from '../search-pj/search-pj';

@Component({
  selector: 'page-car-select-pj',
  templateUrl: 'car-select-pj.html',
})
export class carSelectPjPage {
  memberIdd: string;
  rightCateMsg: any;
  flag: boolean = true;
  memberId = {};
  callback;
  addpro;

  leftCate =
    [
    ];
  rightCate = [
  ];





  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public websites: WebSites) {
    this.callback = this.navParams.get('callback');
    this.addpro = this.navParams.get('addpro');
  }

  ionViewDidLoad() {
    this.getData();


  }
  searchPro() {
    this.navCtrl.push(searchPjPage, { callback: this.callback, addpro: this.addpro })

  }
  getData() {



    this.websites.httpPost('findCategoryList', true).subscribe(res => {
      if (res != null) {
        res.forEach((a, index) => {
          if (index == 0) {
            a.select = true;
            this.getRightData(a.category_id);
          } else {
            a.select = false;
          }
        })
        this.leftCate = res;
      }
    }, error => {
      console.error(error);
    });
  }
  selectItem(i) {
    this.leftCate.forEach(element => {
      if (element['select']) {
        element.select = false;
      }
    });
    i.select = true;
    i.category_id;
    this.getRightData(i.category_id);
  }
  hyselectItem(j) {

    this.navCtrl.push(carEditPjPage, { callback: this.callback, j: j, addpro: this.addpro });
  }
  getRightData(i?) {
    let categoryId = { categoryId: i };
    this.websites.httpPost('findGoodsByCategoryId', categoryId).subscribe(res => {
      if (res != null) {
        this.rightCate = res;

      } else {
        this.rightCate = [];
      }
    }, error => {
      console.error(error);
    });
  }



}
