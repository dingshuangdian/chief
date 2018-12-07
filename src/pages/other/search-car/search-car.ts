import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import { WebSites } from '../../../providers/web-sites';
import { OrderDetailPage } from '../../order/order-detail/order-detail';

/**
 * Generated class for the SearchCarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-car',
  templateUrl: 'search-car.html',
})
export class SearchCarPage {

  queryText: any;
  items = [];//结果数组
  moreData = true;//加载更多
  orderStateName: any;
  searchCarParam = {
    page: 1,
    row: 20,
    sord: 'desc',
    sidx: 'fillDate',
    keyWords: ''
  };
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public webSites: WebSites,
    public viewController: ViewController) {
  }

  ionViewDidLoad() {
 
  }

  searchCar(text){
    this.moreData = true;
    this.searchCarParam.page = 1;
    this.searchCarParam.keyWords = text;
    this.webSites.httpPost('orderList',this.searchCarParam).subscribe(
      (res) => {
        this.items = res;
        if(this.items){
          for(var i=0;i< this.items.length;i++){
            this.items[i].orderStateName = this.orderState(this.items[i].orderStateId);
          }
        }
      }
    );
  }

  closeModule(){
    this.viewController.dismiss()
  }

  gotoDetail(orderId){
    this.navCtrl.push(OrderDetailPage,{
      'orderId': orderId
    });
  }

  orderState(stateId){
    switch(stateId){
      case 5001:
      case 6001:
        return this.orderStateName = '进行中';
      case 5002:
      case 6002:
        return this.orderStateName = '已挂起';
      case 5003:
      case 6003:
        return this.orderStateName = '已完成';
      case 5004:
      case 6004:
        return this.orderStateName = '已取消';
      case 5005:
      case 6005:
        return this.orderStateName = '已挂账';
    }
  }

  doInfinite(infiniteScroll){
    this.searchCarParam.page++;
    this.webSites.httpPost('orderList',this.searchCarParam).subscribe(
      (res) => {
        if(res){
          for(var i=0;i< res.length;i++){
            res[i].orderStateName = this.orderState(res[i].orderStateId);
            this.items.push(res[i]);
          }
        }
        if(res.length < this.searchCarParam.row){
          this.moreData = false;
        }
        infiniteScroll.complete();
      }
    );
  }
}
