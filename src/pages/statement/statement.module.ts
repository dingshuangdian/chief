import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatementPage } from './statement';
import { IncomeGatherPage } from './income-gather/income-gather';
import { IncomeCountPage } from './income-count/income-count';
import { CommissionCountPage } from './commission-count/commission-count';
import { PsnCommissionCountPage } from './commission-count/psn-commission-count/psn-commission-count';
import { NopromittPage } from './nopromitt/nopromitt';

@NgModule({
  declarations: [
    StatementPage,
    IncomeGatherPage,
    IncomeCountPage,
    CommissionCountPage,
    PsnCommissionCountPage,
    NopromittPage
    

  ],
  imports: [
    IonicPageModule.forChild(StatementPage),
  ],
  entryComponents: [
    StatementPage,
    IncomeGatherPage,
    IncomeCountPage,
    CommissionCountPage,
    PsnCommissionCountPage,
    NopromittPage
  ]
})
export class StatementPageModule { }
