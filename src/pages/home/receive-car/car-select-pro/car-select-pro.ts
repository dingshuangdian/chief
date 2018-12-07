import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { WebSites } from '../../../../providers/web-sites';
import { carAddProPage } from '../car-add-pro/car-add-pro';
import { resourcesStaticProvider } from '../../../../providers/resources-static';

@Component({
  selector: 'page-car-select-pro',
  templateUrl: 'car-select-pro.html',
})
export class carSelectProPage {
  memberIdd: string;
  flag: boolean = true;

  memberId: string;
  PType: string;
  callback: any;

  leftCate = [];
  rightCate = [];


  mcardServices: any = [];
  servicesList: any = [];

  services: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, public servicsData: resourcesStaticProvider) {
    this.callback = this.navParams.get('callback');
    this.memberId = this.navParams.get('memberId');
    this.PType = this.navParams.get('PType');
    this.services = this.navParams.get('services');
  }

  ionViewDidLoad() {
    this.getData(this.memberId);
  }

  getData(memberId) {
    this.servicsData.loadService(memberId).then(res => {
      if (res['mcardServices']) {
        this.mcardServices = res['mcardServices'];
        this.leftCate.push({ flName: "会员卡", select: false, service: this.mcardServices });
      }


      if (this.PType == "common") {
        if (res['services']) {
          this.servicesList = res['services'];
          this.servicesList.forEach((s, index, array) => {
            let newS = { flName: s.typName, select: false, service: s.childtypeList }
            this.leftCate.push(newS);

            if (index === array.length - 1) {
              this.dataConfig();
            }
          });
        }

      }

      if (this.PType == "conduct") {
        this.websites.httpPost('findCustomService4Order',{}).subscribe(res => {
          let newS = { flName: "自定义", select: false, service: res };
          this.leftCate.push(newS);
          this.dataConfig();
        })
      }

    })
  }

  dataConfig() {
    if (this.leftCate.length > 0) {
      this.leftCate[0].select = true;
      this.rightCate = this.leftCate[0].service;
      this.flag = this.leftCate[0].flName !== "会员卡" ? true : false;
      if (this.PType == "common") {
        if (this.leftCate[0].flName == "会员卡") {
          let member = this.leftCate[0];
          member.service.forEach(os => {
            os.childtypeList.forEach(c => {
              c.select = false;
              c.disable = false;
              this.services.forEach(s => {
                if (s.serviceId == c.serviceId) {
                  c.select = true;
                  c.disable = true;
                }
              });
            });
          });
          this.leftCate.forEach((e, index) => {
            if (index != 0) {
              e.service.forEach(os => {
                os.select = false;
                os.disable = false;
                this.services.forEach(s => {
                  if (s.serviceId == os.serviceId) {
                    os.select = true;
                    os.disable = true;
                  }
                });
              });
            }
          })

        } else {

          this.leftCate.forEach((e, index) => {
            e.service.forEach(os => {
              os.select = false;
              os.disable = false;
              this.services.forEach(s => {
                if (s.serviceId == os.serviceId) {
                  os.select = true;
                  os.disable = true;
                }
              })
            });
          });

        }
      }

    }
  }

  selectItem(i) {
    this.leftCate.forEach(element => {
      element.select = false;
    });
    i.select = true;
    this.flag = i.flName !== "会员卡" ? true : false;
    this.rightCate = i.service;
  }
  hyselectItem(j) {
    if (this.PType == "conduct") {
      let service = { servicePrice: 0, serviceNum: 0, goodsPrice: 0, serviceId: '', serviceName: "", showServicePrice: 0, svctypeId: 3, svctypePId: '', goodsNum: 0, discountAmount: 0, mcardId: '', totalAmount: 0, discountId: '', order2serviceId: '', serviceCoefficient: 100 };
      service.goodsPrice = j.goodsPrice;
      service.serviceName = j.serviceName;
      service.serviceId = j.serviceId;
      service.mcardId = j.mcardId;
      service.svctypePId = j.svctypePId;
      service.servicePrice = j.servicePrice;
      service.svctypeId = j.svctypeId;
      this.navCtrl.push(carAddProPage, { callback: this.callback, j: service, addpro: '编辑项目' });
    }

    if (this.PType == "common") {
      j.select = !j.select;
      j.servicePrice = j.servicePrice || 0;
      j.goodsPrice = j.goodsPrice || 0;
      j.serviceNum = j.serviceNum || 1;
      j.goodsNum = j.goodsNum || 1;
      j.serviceCoefficient = j.serviceCoefficient || 100;
      j.goodsCoefficient = j.goodsCoefficient || 100;
    }

  }

  finish() {
    let selectService = [];

    if (this.leftCate[0].flName == "会员卡") {
      let member = this.leftCate[0];
      member.service.forEach(os => {
        os.childtypeList.forEach(c => {
          !c.disable && c.select && selectService.push(c);
        });
      });
      this.leftCate.forEach((e, index) => {
        if (index != 0) {
          e.service.forEach(os => {
            !os.disable && os.select && selectService.push(os);
          });
        }
      })
    } else {
      this.leftCate.forEach((e, index) => {
        e.service.forEach(os => {
          !os.disable && os.select && selectService.push(os);
        });
      });

    }

    this.callback(selectService).then(() => {
      this.navCtrl.pop();
    })
  }

}
