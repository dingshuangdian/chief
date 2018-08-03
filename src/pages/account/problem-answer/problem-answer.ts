import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProblemAnswerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-problem-answer',
  templateUrl: 'problem-answer.html',
})
export class ProblemAnswerPage {

  selLis = [
    {flag: true},
    {flag: true},
    {flag: true},
    {flag: true},
    {flag: true},
    {flag: true},
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProblemAnswerPage');
  }

  sel(index){
    for(let i=0;i<this.selLis.length;i++){
      this.selLis[i].flag = true;
    }
    this.selLis[index].flag = false;
  }
}
