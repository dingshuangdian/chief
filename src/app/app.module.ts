import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { HomeModule } from '../pages/home/home.module';
import { OrderPageModule } from '../pages/order/order.module';
import { AccountPageModule } from '../pages/account/account.module';
import { StatementPageModule } from '../pages/statement/statement.module';

import { IdOrcPage } from '../pages/id-orc/id-orc';

import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';

import { resourcesStaticProvider } from '../providers/resources-static';
import { CsInterceptor } from '../providers/cs-interceptor';
import { WebConfig } from '../providers/web-config';


import { UserData } from '../providers/user-data';
import { WebSites } from '../providers/web-sites';


import { ProvincesPage } from '../pages/other/provinces/provinces'
import { SearchCarPage } from '../pages/other/search-car/search-car'
import { CsModal } from '../providers/cs-modal';

import { ProvincesSelectPage } from '../pages/other/provinces-select/provinces-select';
import { MntcSelectPage } from '../pages/other/mntc-select/mntc-select';

import { CsbzNave } from '../providers/csbz-nave';

import { DatePipe } from '@angular/common';

import { SlidesPage } from '../pages/slides/slides';
import { Keyboard } from '@ionic-native/keyboard';
import { CzTestPage } from '../pages/cz-test/cz-test';

@NgModule({
  declarations: [
    MyApp,
    IdOrcPage,
    TabsPage,
    LoginPage,
    ProvincesPage,
    SearchCarPage,
    ProvincesSelectPage,
    MntcSelectPage,
    SlidesPage,
    CzTestPage

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HomeModule,
    OrderPageModule,
    AccountPageModule,
    StatementPageModule,

    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',
      iconMode: 'ios',
      mode: 'ios',
      backButtonText: '',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot({
      name: 'czbsApp',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IdOrcPage,
    TabsPage,
    LoginPage,
    ProvincesPage,
    SearchCarPage,
    ProvincesSelectPage,
    MntcSelectPage,
    SlidesPage,
    CzTestPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: CsInterceptor, multi: true },
    resourcesStaticProvider,
    WebConfig,
    CsbzNave,
    UserData,
    WebSites,
    CsModal,
    DatePipe,
    Keyboard

  ]
})
export class AppModule { }
