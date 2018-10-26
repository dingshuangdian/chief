import { Injectable } from '@angular/core';

import { Events, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { WebSites } from './web-sites'
import { Observable } from 'rxjs/Observable';
import { JPush } from '@jiguang-ionic/jpush';


@Injectable()
export class UserData {
  constructor(
    public events: Events,
    public storage: Storage,
    public jpush: JPush,
    public platform: Platform,
    public websites: WebSites,
    public alertCtrl: AlertController,
  ) { }

  setToken(tokenId: string): void {
    window.localStorage.setItem('tokenId', tokenId);
  };

  getToken(): string {
    return window.localStorage.getItem('tokenId');
  }

  removeToken(): void {
    window.localStorage.removeItem('tokenId');
  }

  setLgiName(lgiName: string): void {
    window.localStorage.setItem('lgiName', lgiName);
  }
  getLgiName(): string {
    return window.localStorage.getItem('lgiName');
  }

  setLgiPwd(lgiPwd: string): void {
    window.localStorage.setItem('lgiPwd', lgiPwd);
  }
  getLgiPwd(): string {
    return window.localStorage.getItem('lgiPwd');
  }

  getUserInfo(fresh: boolean = false): any {
    if (window.localStorage.getItem('userInfo') && !fresh) {
      let userInfor = window.localStorage.getItem('userInfo');
      return Observable.of(JSON.parse(userInfor));
    } else {
      return this.websites.httpPost('getUserInfo', {}).map(data => {
        window.localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
      })
    }
  }

  removeUserInfo(): void {
    window.localStorage.removeItem('userInfo');
  }

  logout() {
    this.removeUserInfo();
    this.removeToken();

  }
  onLogin(lgiName, lgiPwd, callback) {
    let loginInfo = {
      lgiName: lgiName,
      lgiPwd: lgiPwd.toString()
    }
    this.websites.httpPost('login', loginInfo).subscribe(res => {
      this.setToken(res.tokenId);
      this.setLgiName(lgiName);
      this.setLgiPwd(lgiPwd);
      this.getUserInfo(true).subscribe(data => {
        callback();
        this.events.publish('user:login');
      });
    })
  }
}
