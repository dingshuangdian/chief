import { NavController } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WebSites } from '../../providers/web-sites';
@Component({
  selector: 'pay-type',
  templateUrl: 'pay-type.html'
})
export class PayTypeComponent {
  @Input() memberId: string;
  @Output() selectEvent = new EventEmitter<any>();

  payList: Array<any>;
  cardsList: Array<any>;

  selectSalecard = { paymentId: 0 };

  constructor(public navCtrl: NavController,
    public websites: WebSites) {

  }

  ngOnInit() {
    this.findPaymentAndCard();
  }

  findPaymentAndCard() {
    let parmas = this.memberId ? { memberId: this.memberId } : {};

    this.websites.httpPost('findPaymentAndCard', parmas).subscribe(res => {
      if (res && res.payments) {
        this.payList = res.payments;
        if (res.cards) {
          this.cardsList = res.cards;
          this.selectSalecard = this.payList[1];
          this.selectEvent.emit({ paymentId: this.selectSalecard.paymentId, mcardId: "" });
        } else {
          this.selectSalecard = this.payList[0];
          this.selectEvent.emit(this.selectSalecard);
        }
      }
    });
  }

  changeType(selectSalecard) {
    if (this.cardsList) {
      this.cardsList.forEach(e => {
        e.select = false;
      })
    }

    if (selectSalecard.hasOwnProperty('paymentId')) {
      if (selectSalecard.paymentId !== 11) {
        this.selectEvent.emit(selectSalecard);
      } else {
        this.selectEvent.emit({ paymentId: this.selectSalecard.paymentId, mcardId: "" });
      }
    } else {
      selectSalecard.select = true;
      this.selectEvent.emit({ paymentId: this.selectSalecard.paymentId, mcardId: selectSalecard.mcardId, mcardBalance: selectSalecard.mcardBalance });
    }
  }
}
