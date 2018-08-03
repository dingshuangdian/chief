import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { AboutChiefPage } from './about-chief/about-chief';
import { ProblemAnswerPage } from './problem-answer/problem-answer';

@NgModule({
  declarations: [
    AccountPage,
    AboutChiefPage,
    ProblemAnswerPage
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
  ],
  entryComponents: [
    AboutChiefPage,
    ProblemAnswerPage
  ]
})
export class AccountPageModule {}
