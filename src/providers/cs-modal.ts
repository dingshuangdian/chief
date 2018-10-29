import { Injectable } from '@angular/core';

import { LoadingController, AlertController, ToastController, ModalController, PopoverController } from 'ionic-angular';

@Injectable()
export class CsModal {

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController,
        private PopoverCtrl: PopoverController) { }

    appendCSSString = function (css) {
        this.renderer.appendChild(document.head, '<style type="text/css">@charset "UTF-8";' + css + '</style>');
    }

    showModal(component: any, css: string = '', callback?) {
        let profileModal = this.modalCtrl.create(component, {}, { cssClass: css });
        profileModal.onDidDismiss(data => {
            if (callback && data) callback(data);
        });
        profileModal.present();
    }


    showProvince(component: any, callback?) {
        this.showModal(component, 'provincesModal', callback);
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

}
