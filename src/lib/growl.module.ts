import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";

import {GrowlComponent} from "./growl.component";
import {
  GroundwaterLevelStationIconComponent
}
  from "./groundwater-level-station-icon/groundwater-level-station-icon.component";
import { StationInfoControlComponent } from "./station-info-control/station-info-control.component";
import { CommonModule } from "@angular/common";



@NgModule({
  declarations: [
    GrowlComponent,
    GroundwaterLevelStationIconComponent,
    StationInfoControlComponent
  ],
  imports: [
    CommonModule,
    WisdomModule,
    TranslateModule
  ],
  exports: [
    GrowlComponent
  ]
})
export class GrowlModule { }
