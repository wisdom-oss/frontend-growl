import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";

import {GrowlComponent} from "./growl.component";



@NgModule({
  declarations: [
    GrowlComponent
  ],
  imports: [
    WisdomModule,
    TranslateModule
  ],
  exports: [
    GrowlComponent
  ]
})
export class GrowlModule { }
