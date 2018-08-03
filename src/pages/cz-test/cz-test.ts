import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController } from 'ionic-angular';
import { WebSites } from '../../providers/web-sites';
import { CsbzNave } from '../../providers/csbz-nave';

/**
 * Generated class for the CzTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-cz-test',
  templateUrl: 'cz-test.html',
})
export class CzTestPage {


  public imageData;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public webSites: WebSites,
    public csbzNave:CsbzNave
    

  ) {
  }

  ionViewDidLoad() {

  }

  fileChange(event) {
    this.webSites.qiniuUpload(this.imageData).subscribe(result => {
      console.log(result);
    })
  }
  getPicture() {
    this.csbzNave.selecPicture((data) => {
      var image = document.getElementById('myImage');
      image["src"] = data.imageSrc;
      this.imageData = data.imageBlob;
    })
  }
}
