import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { OrderDetailPage } from './order-detail/order-detail';

import { AccountOrderPage } from './account-order/account-order';
import { PayRecordlPage } from './pay-record/pay-record';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    OrderPage,
    OrderDetailPage,
    AccountOrderPage,
    PayRecordlPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(OrderPage),
  ],
  entryComponents: [
    OrderPage,
    OrderDetailPage,
    AccountOrderPage,
    PayRecordlPage
  ]
})
export class OrderPageModule {}
