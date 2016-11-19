import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Xbase } from './xbase';
import { XbaseTestPage } from './xbase-test';

export let LINKS = [
        { component: XbaseTestPage, name: 'XbaseTest', segment: 'test/xbase' },
        { component: XbaseTestPage, name: 'XbaseTest', segment: 'test/xbase/:method' }
];

@NgModule({
  declarations: [
    XbaseTestPage
  ],
  imports: [
      IonicModule
  ],
  entryComponents: [
    XbaseTestPage
  ],
  providers: [ Xbase ]
})
export class XbaseApiModule {}
