import {NgModule} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";

import {GrowlComponent} from "./growl.component";
import {
  GroundwaterLevelStationIconComponent
}
  from "./map/groundwater-level-station-icon/groundwater-level-station-icon.component";
import { StationInfoControlComponent } from "./map/station-info-control/station-info-control.component";
import { CommonModule } from "@angular/common";
import { GroundwaterInfoControlComponent } from './map/groundwater-info-control/groundwater-info-control.component';
import { FormsModule } from "@angular/forms";
import { CountyInfoControlComponent } from './map/county-info-control/county-info-control.component';
import { WithdrawalInfoControlComponent } from './map/withdrawal-info-control/withdrawal-info-control.component';



@NgModule({
  declarations: [
    GrowlComponent,
    GroundwaterLevelStationIconComponent,
    StationInfoControlComponent,
    GroundwaterInfoControlComponent,
    CountyInfoControlComponent,
    WithdrawalInfoControlComponent
  ],
  imports: [
    CommonModule,
    WisdomModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    GrowlComponent
  ]
})
export class GrowlModule { }
