import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { receiveCarPage } from './receive-car/receive-car';
import { orderItemPage } from './receive-car/order-item/order-item'
import { carEditPage } from './receive-car/car-edit/car-edit';
import { carTypePage } from './receive-car/car-type/car-type';
import { orderEditPage } from './receive-car/order-edit/order-edit';
import { ComponentsModule } from '../../components/components.module';
import { OrderEditSelectPage } from './receive-car/order-edit/order-edit-select/order-edit-select';
import { orderPostPage } from './receive-car/order-post/order-post';
import { AgentPopoverComponent } from '../other/agent-popover/agent-popover';
import { EditPlatnumPopoverPage } from '../other/edit-platnum-popover/edit-platnum-popover';
import { CarownerPopoverPage } from '../other/carowner-popover/carowner-popover';
import { carConductPage } from './receive-car/car-conduct/car-conduct';
import { carAddProPage } from './receive-car/car-add-pro/car-add-pro';
import { carSelectProPage } from './receive-car/car-select-pro/car-select-pro';
import { carTypeItemPage } from './receive-car/car-type/car-type-item/car-type-item';
import { carSelectPjPage } from './receive-car/car-select-pj/car-select-pj';
import { carEditPjPage } from './receive-car/car-edit-pj/car-edit-pj';
import { addProjectPopoverComponent } from '../other/add-project-popover/add-project-popover';
import { discountPopover } from '../other/discount-popover/discount-popover';
import { toastProjectPopoverComponent } from '../other/toast-project-popover/toast-project-popover';
import { MergePopoverComponent } from '../other/merge-popover/merge-popover';
import { memoRecordPage } from './receive-car/order-item/memo-record/memo-record';
import { newCarEditPage } from './receive-car/new-car-edit/new-car-edit';
import { addMemoPopoverComponent } from '../other/add-memo-popover/add-memo-popover';
import { handleMemoPopoverComponent } from '../other/handle-memo-popover/handle-memo-popover';
import { updateMemoPopoverComponent } from '../other/update-memo-popover/update-memo-popover';
import { washCarPage } from './receive-car/wash-car/wash-car';
import { memberMngPage } from './member-mng/member-mng';
import { customPage } from './custom/custom';
import { newCustomPage } from './custom/new-custom/new-custom';
import { memberOpenPage } from './member-mng/member-open/member-open';
import { memberOpenCertainPage } from './member-mng/member-open-certain/member-open-certain';
import { ConsumerMsgPage } from './custom/consumer-msg/consumer-msg';
import { memberOpenSuccessPage } from './member-mng/member-open-success/member-open-success';
import { PayRecordlPage_ } from '../order/pay-record_/pay-record_';
import { appointmentMngPage } from './appointment-mng/appointment-mng';
import { memberRechargePage } from './member-mng/member-recharge/member-recharge';
import { RecordPage } from './record/record';
import { RecordPageEdit } from './record/record-edit/record-edit';
import { RecordPageRegistere } from './record/record-registere/record-registere';
import { BusinessRemindPage } from './business-remind/business-remind';
import { VisitedMsgPage } from './business-remind/visited-msg/visited-msg';
import { CheckHelpPage } from './check-help/check-help';
import { hycountPopover } from '../other/hycount-popover/hycount-popover';
import { pickupCarPage } from '../home/receive-car/pickup-car/pickup-car';
@NgModule({
  declarations: [
    HomePage,
    receiveCarPage,
    orderItemPage,
    carEditPage,
    carTypePage,
    orderEditPage,
    OrderEditSelectPage,
    orderPostPage,
    AgentPopoverComponent,
    EditPlatnumPopoverPage,
    CarownerPopoverPage,
    MergePopoverComponent,
    addProjectPopoverComponent,
    discountPopover,
    hycountPopover,
    carConductPage,
    carAddProPage,
    carSelectProPage,
    carTypeItemPage,
    carSelectPjPage,
    carEditPjPage,
    toastProjectPopoverComponent,
    memoRecordPage,
    newCarEditPage,
    addMemoPopoverComponent,
    handleMemoPopoverComponent,
    updateMemoPopoverComponent,
    washCarPage,
    memberMngPage,
    customPage,
    newCustomPage,
    memberOpenPage,
    memberOpenCertainPage,
    ConsumerMsgPage,
    PayRecordlPage_,
    memberRechargePage,
    BusinessRemindPage,
    VisitedMsgPage,
    memberOpenSuccessPage,
    PayRecordlPage_,
    appointmentMngPage,
    RecordPage,
    RecordPageEdit,
    RecordPageRegistere,
    CheckHelpPage,
    pickupCarPage
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    HomePage,
    receiveCarPage,
    orderItemPage,
    carEditPage,
    carTypePage,
    orderEditPage,
    OrderEditSelectPage,
    orderPostPage,
    AgentPopoverComponent,
    EditPlatnumPopoverPage,
    CarownerPopoverPage,
    MergePopoverComponent,
    addProjectPopoverComponent,
    discountPopover,
    hycountPopover,
    carConductPage,
    carAddProPage,
    carSelectProPage,
    carTypeItemPage,
    carSelectPjPage,
    carEditPjPage,
    toastProjectPopoverComponent,
    memoRecordPage,
    newCarEditPage,
    addMemoPopoverComponent,
    handleMemoPopoverComponent,
    updateMemoPopoverComponent,
    washCarPage,
    memberMngPage,
    customPage,
    newCustomPage,
    memberOpenPage,
    memberOpenCertainPage,
    ConsumerMsgPage,
    PayRecordlPage_,
    memberRechargePage,
    memberOpenSuccessPage,
    PayRecordlPage_,
    appointmentMngPage,
    RecordPage,
    RecordPageEdit,
    RecordPageRegistere,
    BusinessRemindPage,
    VisitedMsgPage,
    CheckHelpPage,
    pickupCarPage
  ]
})
export class HomeModule { }
