import { NgModule } from '@angular/core';
import { Xbase } from './xbase';
import { XbaseTestPage } from './xbase-test';

export let ROUTES = [
        { path: "test/xbase", component: XbaseTestPage, name: 'XbaseTest' },
        { path: "test/xbase/:method", component: XbaseTestPage, name: 'XbaseTest' }
];

@NgModule({
  declarations: [
    XbaseTestPage
  ],
  imports: [],
  entryComponents: [
    XbaseTestPage
  ],
  providers: [ Xbase ]
})
export class XbaseApiModule {}
