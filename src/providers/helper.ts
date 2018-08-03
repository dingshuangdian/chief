import {Injectable} from "@angular/core";
import {
  LoadingController,
  ToastController,
  ModalController,
  PopoverController,
  AlertController,
  App, Events
} from 'ionic-angular';
import { Headers} from '@angular/http';
import  _ from "lodash";


@Injectable()
export class Helper {

  public headers:Headers;
  public loading;

  constructor(
    public loadingCtrl:LoadingController,
    public toastCtrl:ToastController,
    public modalCtrl:ModalController,
    public popCtrl:PopoverController,
    public alertCtrl:AlertController,
    public events:Events
  ){}

  /**
   *   显示loading，并返回loading配置对象
   *   输入值：  [msg]  /可选，用户自定义提示信息
   *   返回值： Object
   * */
  getLoadingConfig(msg? : string) {
    return {
      showBackdrop:false,
      cssClass:'primary',
      content: msg ? msg : '数据加载中...'
    };
  }

  /**
   *   通用请求头部对象
   *   输入值：  [msg]  /可选，用户自定义提示信息
   *   返回值： Headers实例
   * */
  getHttpHeaders(opts? : Object[]){

    this.headers = new Headers();
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");

    return this.headers;
  }

  /**
   *   显示loading，并返回loading对象
   *   输入值：  [msg]  /可选，用户自定义提示信息
   *   返回值： LoadingController实例
   * */
  showLoading(msg?:string){
    this.loading = this.loadingCtrl.create(this.getLoadingConfig(msg));
    this.loading.present();
    return this.loading;
  }
  /**
   *   隐藏loading
   * */
  hideLoading(){
    this.loading.dismiss();
  }

  /**
   *   显示toast，并返回toast对象
   *   输入值：  [msg]  /可选，用户自定义提示信息
   *   返回值： ToastController实例
   * */
  showTips(msg?:string,opts?:any){

      let defaultOpts = {
        message: msg ? msg : '提示',
        position: 'middle',
        duration: 3000,
        cssClass:'toast-blue',
        dismissOnPageChange:true
      }

      if(opts){
        defaultOpts =Object.assign(defaultOpts,opts)
      }
      let toast = this.toastCtrl.create(defaultOpts);
      toast.present();
      return toast;
  }
  /**
   *   模态窗口
   *   输入值：  [Page]  /可选，页面实例
   *   返回值： ToastController实例
   * */
  showModalPage(page:any,data?:any,opts?:any){
      let _data = {},_opts ={};
      if(data){
        _data = _.assign({},data);
      }
      if(_opts){
        _opts = _.assign({},_opts);
      }
      let modal = this.modalCtrl.create(page,_data,_opts);
      modal.present();
      return modal;
  }
  /**
   *   模态窗口
   *   输入值：  [Page]  /可选，页面实例
   *   返回值： ToastController实例
   * */
  showPopoverPage(page:any,data?:any,opts?:any){
      let _data = {},_opts ={};
      if(data){
        _data = _.assign({},data);
      }
      if(_opts){
        _opts = _.assign({},_opts);
      }
      let pop = this.popCtrl.create(page,_data,_opts);
      pop.present();
      return pop;
  }
  /**
   *   确认弹窗
   *   输入值：  [Page]  /可选，页面实例
   *   返回值： ToastController实例
   * */
  showConfirm(opts?:any,cancelCb?:any,okCb?:any){
    let _opts ={};
    if(opts){
      _opts = _.assign({
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              if(cancelCb){
                cancelCb();
              }
            }
          },
          {
            text: '确定',
            handler: () => {
              okCb()
            }
          }
        ]
      },opts)
    }

    let alert = this.alertCtrl.create(_opts);
    alert.present();
      return alert;
  }


  /**
   *
   *   发送出错事件
   *
   * */
  public_Error(res?:any){
    this.events.publish('ccb:get:error',{res:res})
  }

  /**
   *
   *   取消订阅事件
   *
   * */
  unsubscribeForArray(subs?:any){

    _.forEach(subs,item=>{
      this.events.unsubscribe(''+item);
    })

  }


}
