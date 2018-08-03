import { NavController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WebSites } from '../../providers/web-sites';
import { WebConfig } from '../../providers/web-config';
@Component({
  selector: 'mcard-grid',
  templateUrl: 'mcard-grid.html'
})
export class mcardGridComponent {
  @Input() memberId: string;
  
  img_path = WebConfig.img_path;


  public memberCard: any = { show: true, card: [] };

  constructor(public navCtrl: NavController,
    public websites: WebSites) {

  }

  ngOnInit() {
    this.findMemberCard();
  }

  findMemberCard() {
    let parmas = this.memberId ? { memberId: this.memberId } : {};
    this.websites.httpPost('findmemberCard', parmas).subscribe(res => {
      if (res != null) {
        this.memberCard.card = res;
      }
    }, error => {

    })
  }
}
