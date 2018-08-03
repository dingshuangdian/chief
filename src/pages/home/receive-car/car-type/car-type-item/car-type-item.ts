import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { resourcesStaticProvider } from '../../../../../providers/resources-static';
import { WebSites } from '../../../../../providers/web-sites';




@Component({
  selector: 'page-car-type-item',
  templateUrl: 'car-type-item.html',
})
export class carTypeItemPage {

  callback;
  title: string = "选择系列";
  typeList: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public carTypeData: resourcesStaticProvider, public webSites: WebSites) {
    this.callback = this.navParams.get("callback");
  }

  ionViewDidLoad() {
    if (this.navParams.get("automakeId")) {
      this.title = "选择系列";
      this.findAutomodel().subscribe((data: any) => {
        this.typeList = data;
      })
    }

    if (this.navParams.get("automodelId")) {
      this.title = "选择车型";
      this.findAutotype().subscribe((data: any) => {
        this.typeList = data;
      })
    }

  }

  typeSelect(c) {
    let carType: object = this.navParams.get('carType');
    if (this.navParams.get("automakeId")) {
      carType['automodel'] = c;
      this.navCtrl.push(carTypeItemPage, { callback: this.callback, automodelId: c.automodelId, carType: carType });
    }

    if (this.navParams.get("automodelId")) {
      carType['autotype'] = c;
      this.callback(carType).then((data) => {
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 4));
      })
    }

  }

  pass() {
    let popNum = 4;
    if (this.navParams.get("automakeId")) popNum = 3;
    let c = this.navParams.get('carType');
    this.callback(c).then(() => {
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - popNum));
    })
  }


  findAutomodel() {
    return this.webSites.httpPost("findautomodels", { automakeId: this.navParams.get("automakeId") }).map((data: any) => {
      data = this.sortOut(data, 'manufacturer');
      return data;
    })
  }

  findAutotype() {
    return this.webSites.httpPost("findautotypes", { automodelId: this.navParams.get("automodelId") }).map((data: any) => {
      data = this.sortOut(data, 'modelYear');
      return data;
    })
  }


  sortOut(data, typName) {
    let newData = [];
    let tagObj = {};
    data.forEach(element => {
      if (!tagObj[element[typName]] && element[typName]) {
        let childtype = [];
        data.forEach((d, index, array) => {
          if (d[typName] == element[typName]) {
            childtype.push(d);
          }

          if (index === array.length - 1) {
            tagObj[element[typName]] = true;
            let newS = {};
            newS['typName'] = element[typName];
            newS['childtypeList'] = childtype;
            newData.push(newS);
          }

        })
      }
    });
    return newData;
  }


}
