import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoadingController, AlertController, ToastController, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { WebConfig } from './web-config';

@Injectable()
export class WebSites {

    constructor(public http: HttpClient, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, public events: Events) { }

    // 对参数进行编码
    encode(params, isForm: boolean = true) {
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    if (typeof (value) == 'object') value = JSON.stringify(value);
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = str.substring(0, str.length - 1);
        }

        if (!isForm) return '?' + str;

        const tParams = new HttpParams({ fromString: str });

        return tParams;
    }

    httpGet(url, params: object = {}, loader: boolean = true, isShowError: boolean = true, judgeUdf: boolean = false) {
        let loading = this.loadingCtrl.create({});
        if (loader) loading.present();
        return this.http.get(WebConfig.server_ + WebConfig.API[url] + this.encode(params, false))
            .map((data: any) => {

                if (loader) loading.dismiss();

                if (judgeUdf) this.handleResult(data.result);

                return data == null ? '[]' : data.result;
            })
            .catch((error: HttpResponse<any>) => {
                if (loader) loading.dismiss();

                if (isShowError) this.handleError(error);

                return Observable.throw(error);
            });
    }

    httpPost(url, params, loader: boolean = true, isShowError: boolean = true, judgeUdf: boolean = false) {
        let loading = this.loadingCtrl.create();
        if (loader) loading.present();

        const headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");

        return this.http.post(WebConfig.server_ + WebConfig.API[url], this.encode(params), { headers, withCredentials: true })
            .map((data: any) => {

                if (loader) loading.dismiss();

                if (judgeUdf) this.handleResult(data.result);

                return data == null ? '[]' : data.result;
            })
            .catch((error: HttpResponse<any>) => {
                if (loader) loading.dismiss();

                if (isShowError) this.handleError(error);

                return Observable.throw(error);
            })
    }


    qiniuUpload(dataInfo) {
        let loading = this.loadingCtrl.create({
            content: "上传中..."
        });
        loading.present();

        if (Object.prototype.toString.call(dataInfo) === '[object Array]') {
            let postRequtArr = [];
            dataInfo.forEach(imageData => {
                let postR = this.oneUpload(imageData);
                postRequtArr.push(postR);
            });

            return Observable.combineLatest(postRequtArr).map((data: any) => {
                loading.dismiss();
                return data;
            })
        } else {
            return this.oneUpload(dataInfo).map((data: any) => {
                loading.dismiss();
                return data;
            });
        }
    }

    oneUpload(imageData) {
        const headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post(WebConfig.server_ + WebConfig.API['qiniuToken'], this.encode({}), { headers, withCredentials: true })
            .map((data: any) => {
                return data == null ? '[]' : data.result;
            })
            .mergeMap((tokey: any) => {
                let formData: FormData = new FormData();
                formData.append("key", tokey.key);
                formData.append("token", tokey.token);
                formData.append("file", imageData, "file_" + Date.parse(new Date().toString()) + ".jpg");
                return this.http.post(WebConfig.qiniuServe, formData)
            })
    }



    private handleResult(data) {
        data = data == null ? '[]' : data;
        if (typeof data === 'object') {
            if (data !== null) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (data[key] == null) data[key] = "";
                    }
                }
            }
            else if (data instanceof Array) {
                data.forEach(d => {
                    this.handleResult(d);
                });
            }
        }
    }


    private handleError(error: Response | any) {
        let msg = '';
        if (error.status == 0) {
            msg = error.message;
            console.log('发生未知错误');
        }
        if (error.status == 200) {

            if (error.body && error.body.msg == 'NOT_LOGIN') {
                this.events.publish('user:logout');
            } else {
                msg = error.message;
                if (!msg) {
                    this.alert(error.body.msg)
                }
            }

            console.log('请检查请求参数或url是否匹配');
            return;
        }
        if (error.status == 401) {
            this.events.publish('user:logout');
            return;
        }
        if (error.status == 405) {
            msg = '没有权限(code：405)';
        }
        if (error.status == 400) {
            msg = '请求无效(code：400)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }

        if (msg != '') {
            console.error(msg);
            this.toast("网络异常，请稍后重试");
        }


    }

    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [{
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }

    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    setItem(key: string, obj: any) {
        try {
            var json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    getItem(key: string, callback) {
        try {
            var json = window.localStorage[key];
            var obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }

}
