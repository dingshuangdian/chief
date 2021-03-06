import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ImgLazyLoadComponent } from './img-lazy-load/img-lazy-load';
import { PayTypeComponent } from './pay-type/pay-type';
import { mcardGridComponent } from './mcard-grid/mcard-grid';
import { SubTitleComponent } from './sub-title/sub-title';

@NgModule({
	declarations: [ImgLazyLoadComponent,
		PayTypeComponent,
		mcardGridComponent,
    SubTitleComponent,
],
	imports: [IonicModule],
	exports: [ImgLazyLoadComponent,
		PayTypeComponent,
		mcardGridComponent,
    SubTitleComponent,
]
})
export class ComponentsModule { }
