import { Injectable } from '@angular/core';

import { LoadingController, AlertController, ToastController, ModalController, PopoverController } from 'ionic-angular';

@Injectable()
export class CsModal {
    loadingIsOpen: any;
    loading: any;
    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private PopoverCtrl: PopoverController) { }

    appendCSSString = function (css) {
        this.renderer.appendChild(document.head, '<style type="text/css">@charset "UTF-8";' + css + '</style>');
    }

    showModal(component: any, css: string = '', enableBackdropDismiss: boolean = true, obj?, callback?) {
        let profileModal = this.modalCtrl.create(component, obj, { cssClass: css, enableBackdropDismiss: enableBackdropDismiss });
        profileModal.onDidDismiss(data => {
            if (callback && data) callback(data);
        });
        profileModal.present();
    }


    showProvince(component: any, obj?, enableBackdropDismiss?, callback?) {
        this.showModal(component, 'provincesModal', enableBackdropDismiss, obj, callback);
    }
    showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            position: 'middle',
            duration: 3000,
            dismissOnPageChange: true
        });
        toast.present();
    }
    showToastbottom(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            position: 'bottom',
            duration: 3000,
            dismissOnPageChange: true
        });
        toast.present();
    }

    showAlert(msg, certainCallback?, cancelCallback?, certainText?, cancelText?, title?) {

        let option = {};
        if (cancelCallback) {
            option = {
                title: title || '提示',
                subTitle: msg,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: cancelText ? cancelText : '取消',
                        role: 'cancel',
                        handler: () => {
                            if (typeof cancelCallback == 'function') {
                                cancelCallback();
                            }
                        }
                    },
                    {
                        text: certainText ? certainText : '确定',
                        handler: () => {
                            if (typeof certainCallback == 'function') {
                                certainCallback();
                            }
                        }
                    }
                ]
            }
        } else {
            option = {
                title: title || '提示',
                subTitle: msg,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: certainText ? certainText : '确定',
                        handler: () => {
                            if (typeof certainCallback == 'function') {
                                certainCallback();
                            }
                        }
                    }
                ]
            }
        }

        let alert = this.alertCtrl.create(option);
        alert.present();
    }
    public showLoading(content: any = ''): void {
        if (typeof content != 'string') {
            content = '';
        }
        if (!this.loadingIsOpen) {
            this.loadingIsOpen = true;
            this.loading = this.loadingCtrl.create({
                content: content
            });
            this.loading.present();
            setTimeout(() => { //最长显示10秒
                this.loadingIsOpen && this.loading.dismiss();
                this.loadingIsOpen = false;
            }, 180000);
        } else {
            this.loading.setContent(content);
        }
    };
    public hideLoading(): void {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
    };


    private strNumSize(tempNum) {
        var stringNum = tempNum.toString();
        var index = stringNum.indexOf(".");
        var newNum = stringNum;
        if (index != -1) {
            newNum = stringNum.substring(0, index)
        };
        return newNum.length;
    }
    public unitConvert(num) {
        var moneyUnits = ["", "万", "亿", "万亿"];
        var dividend = 10000;
        var curentNum = num;
        //转换数字
        var curentUnit = moneyUnits[0];
        //转换单位 
        for (var i = 0; i < 4; i++) {
            curentUnit = moneyUnits[i];
            if (this.strNumSize(curentNum) < 5) {
                var stringNum = curentNum.toString();
                var index = stringNum.indexOf(".");
                if (index == -1) {
                    curentNum = curentNum + ".00";
                }
                break;
            };
            curentNum = curentNum / dividend;
            if(curentNum.toString().split(".")[1].length>6){
                curentNum= curentNum.toFixed(6)
            }
        };
        return curentNum + curentUnit;
    }

}
