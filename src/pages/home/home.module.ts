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
import { searchPjPage } from './receive-car/search-pj/search-pj';
import { AutoInsurancePage } from './auto-insurance/auto-insurance';
import { cityPopover } from '../other/city-popover/city-popover';
import { AllInsurancePage } from './auto-insurance/all-insurance/all-insurance';
import { departmentsPopover } from '../other/departments-popover/departments-popover';
import { companyPopover } from '../other/company-popover/company-popover';
import { ExceptionCausePage } from './auto-insurance/exception-cause/exception-cause';
import { MsgInsurancePage } from './auto-insurance/msg-insurance/msg-insurance';
import { CarInsProgressPage } from './auto-insurance/car-ins-progress/car-ins-progress';
import { DetailPolicyPage } from './auto-insurance/detail-policy/detail-policy';
import { SupplementaryInfoPage } from './auto-insurance/supplementary-info/supplementary-info';
import { ReservationListPage } from './auto-insurance/reservation-list/reservation-list';
import { RequotationPage } from './auto-insurance/requotation/requotation';
import { ModifyPolicyPage } from './auto-insurance/modify-policy/modify-policy';
import { PhotoExPage } from './auto-insurance/photo-ex/photo-ex';
import { SelInsuranceCompPage } from './auto-insurance/sel-insurance-comp/sel-insurance-comp';
import { QuotationDetailPage } from './auto-insurance/quotation-detail/quotation-detail';
import { PaymentPolicyPage } from './auto-insurance/payment-policy/payment-policy';
import { SmsPopoverPage } from '../other/sms-popover/sms-popover';
import { InsProgPopoverPage } from '../other/ins-prog-popover/ins-prog-popover';
import { WxPayPopoverPage } from '../other/wx-pay-popover/wx-pay-popover';
import { repertoryPopover } from '../other/repertory-popover/repertory-popover';
import { AgentlistPopoverPage } from '../other/agentlist-popover/agentlist-popover';
import { brandPopover } from '../other/brand-popover/brand-popover';
import { couponPopover } from '../other/coupon-popover/coupon-popover';
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
        pickupCarPage,
        searchPjPage,
        AutoInsurancePage,
        cityPopover,
        AllInsurancePage,
        departmentsPopover,
        companyPopover,
        ExceptionCausePage,
        MsgInsurancePage,
        brandPopover,
        couponPopover,

        CarInsProgressPage,
        DetailPolicyPage,
        SupplementaryInfoPage,
        ReservationListPage,
        RequotationPage,
        ModifyPolicyPage,
        PhotoExPage,
        SelInsuranceCompPage,
        QuotationDetailPage,
        PaymentPolicyPage,
        SmsPopoverPage,
        InsProgPopoverPage,
        WxPayPopoverPage,
        repertoryPopover,
        AgentlistPopoverPage,
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
        pickupCarPage, searchPjPage,
        AutoInsurancePage,
        cityPopover,
        AllInsurancePage,
        departmentsPopover,
        companyPopover,
        ExceptionCausePage,
        MsgInsurancePage,
        repertoryPopover,
        AgentlistPopoverPage,

        brandPopover,
        couponPopover,

        CarInsProgressPage,
        DetailPolicyPage,
        SupplementaryInfoPage,
        ReservationListPage,
        RequotationPage,
        ModifyPolicyPage,
        PhotoExPage,
        SelInsuranceCompPage,
        QuotationDetailPage,
        PaymentPolicyPage,
        SmsPopoverPage,
        InsProgPopoverPage,
        WxPayPopoverPage,
    ]
})
export class HomeModule { }
