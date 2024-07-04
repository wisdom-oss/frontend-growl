import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";

import {GrowlComponent} from "./growl.component";
import { GroundwaterLevelStationIconComponent } from "./groundwater-level-station-icon/groundwater-level-station-icon.component";



@NgModule({
  declarations: [
    GrowlComponent,
    GroundwaterLevelStationIconComponent
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
