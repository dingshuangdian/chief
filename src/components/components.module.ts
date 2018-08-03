import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ImgLazyLoadComponent } from './img-lazy-load/img-lazy-load';
import { PayTypeComponent } from './pay-type/pay-type';
import { mcardGridComponent } from './mcard-grid/mcard-grid';

@NgModule({
	declarations: [ImgLazyLoadComponent,
		PayTypeComponent,
		mcardGridComponent,
],
	imports: [IonicModule],
	exports: [ImgLazyLoadComponent,
		PayTypeComponent,
		mcardGridComponent,
]
})
export class ComponentsModule { }
