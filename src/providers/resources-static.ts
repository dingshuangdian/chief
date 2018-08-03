import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { WebSites } from '../providers/web-sites';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { CsModal } from './cs-modal';


/*
  Generated class for the CartypeDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class resourcesStaticProvider {


  serviceData: any;
  carTypeData: any;

  permissionData: any;

  constructor(
    public webSites: WebSites,
    public storage: Storage,
    private csModal: CsModal,
  ) { }

  //加载权限数据
  loadPermissionCode(callback?: Function): any {
    this.webSites.httpPost('findPermissionCode', {}).subscribe(res => {
      if (Object.prototype.toString.call(res) == '[object Array]') {
        this.permissionData = {};
        res.map(p => {
          if (p.permissionCode == "receiveCarMenu" || p.permissionCode == "orderListMenu" || p.permissionCode == "statTradeReportListMenu" || p.permissionCode == "storeMemberMenu" || p.permissionCode == "reservationMenu" || p.permissionCode == "hasInsur")
            this.permissionData[p.permissionCode] = true;
        });
        callback();
      }
    });
  }

  JdPCode(code, isShowError: boolean = true) {
    return new Promise((resolve, reject) => {
      if (this.permissionData) {
        if (this.permissionData[code]) {
          resolve("有权限");
        } else {
          reject("没权限");
          if (isShowError) {
            this.csModal.showAlert("没有权限访问！");
          }
        }
      } else {
        reject("没数据，请初始化权限数据");
        if (isShowError) {
          this.csModal.showAlert("没权限数据");
        }

      }
    })

  }


  //加载项目数据
  loadService(memberId?,updata:boolean=false) {
    let $this = this;
    return new Promise((resolve, reject) => {
      $this.storage.get('CZBSService').then((serviceData) => {
        if (serviceData&&!updata) {
          $this.serviceData = serviceData;
          if (memberId) {
            $this.webSites.httpPost('findService4Order', { memberId: memberId, service: false }).map($this.mcardServices, $this).subscribe(res => {
              
              resolve(res);
            });
          } else {
            resolve({ services: serviceData });
          }
        } else {
          if (memberId) {
            $this.webSites.httpPost('findService4Order', { memberId: memberId, service: true }).map($this.mcardServices, $this).subscribe(res => {
              resolve(res);
            });
          } else {
            $this.webSites.httpPost('findService4Order', { service: true }).map($this.services, $this).subscribe(res => {
              resolve(res);
            });
          }
        }
      });

    })
  }

  mcardServices(data) {
    let mcardServices;
    let services = this.serviceData;

    if (!data) {
      let res = { mcardServices: mcardServices, services: services }
      return res
    }

    if (data.mcardServices) {
      mcardServices = this.sortOut(data.mcardServices, 'mcardId');
    }
    if (data.services) {
      services = this.sortOut(data.services, 'svctypePName');
      this.storage.set('CZBSService', services);
    }

    let res = { mcardServices: mcardServices, services: services }
    return res;
  }

  services(data) {
    let services;
    if (data.services) {
      services = this.sortOut(data.services, 'svctypePName');
    }

    this.storage.set('CZBSService', services);

    let res = { services: services }
    return res;
  }

  sortOut(data, typName) {
    let newData = [];
    let tagObj = {};
    data.forEach(element => {
      if (!tagObj[element[typName]] && element[typName]) {
        let childtype = [];
        data.forEach((d, index, array) => {
          if (d[typName] == element[typName]) {
            d.select = false;
            childtype.push(d);
          }

          if (index === array.length - 1) {
            tagObj[element[typName]] = true;
            let newS = {};
            if (typName == "mcardId") {
              newS['typName'] = element["mcardName"];
            } else {
              newS['typName'] = element[typName];
            }
            newS['typNo'] = element['mcardNo'] || "";
            newS['stopDate'] = element['stopDate'] || "";
            newS['platNum'] = element['plateNumber'] || "";
            
            newS['mcardBalance'] = element['mcardBalance'] || "";
            newS['childtypeList'] = childtype;
            newS['show'] = true;
            newData.push(newS);
          }

        })
      }
    });
    return newData;
  }






  //加载车型数据
  load(): any {
    if (this.carTypeData) {
      return Observable.of(this.carTypeData);
    } else {
      return this.webSites.httpPost('findautomakes', {}).map(this.processData, this);
    }
  }

  processData(data: any) {
    let indexes = this.getIndexes(data);
    let groupCars = this.getGroupCars(data, indexes);
    this.carTypeData = { indexes: indexes, groupCars: groupCars };
    return this.carTypeData;
  }

  getIndexes(typeInfo): Array<any> {
    var indexes = typeInfo.map(c => {
      return c.firstLetter
    });
    var newindexes = [];
    for (var i = 0; i < indexes.length; i++) {
      var isExists = false;
      var val = indexes[i];
      for (var j = 0; j < newindexes.length; j++) {
        if (newindexes[j] == val) {
          isExists = true;
          break;
        }
      }
      if (isExists == false) {
        newindexes.push(val);
      }
    }
    return newindexes.sort();
  }

  getGroupCars(typeInfo, indexs) {
    var group = [];
    indexs.forEach(function (c) {
      group.push({
        firstLetter: c,
        cars: [],
      })
    }, this);
    group.forEach(c => {
      typeInfo.forEach(car => {
        if (c.firstLetter == car.firstLetter) {
          c.cars.push(car);
        }
      }, this)
    }, this);
    return group;
  }

  filterCars(newVal) {
    var filterCars = [];
    this.carTypeData.groupCars.forEach(cars => {
      cars.cars.forEach(auto => {
        if (auto.automakeName.indexOf(newVal) != -1) {
          filterCars.push(auto);
        }
      })
    })
    return filterCars;
  }
}
