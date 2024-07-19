import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LayerContent, LayerInfo, Map2Control } from "common";
import { GrowlService } from '../../growl.service';
import { BehaviorSubject } from 'rxjs';

import * as L from "leaflet";
import { WithdrawalDisplayComponent } from './withdrawal-display/withdrawal-display.component';

@Component({
  selector: 'lib-withdrawal-info-control',
  templateUrl: './withdrawal-info-control.component.html'
})
export class WithdrawalInfoControlComponent implements Map2Control {

  @ViewChild(WithdrawalDisplayComponent) display?: WithdrawalDisplayComponent;

  name?: string;
  fetching = false;
  min?: number;
  max?: number;

  private isVisibleSubject = new BehaviorSubject(false);
  public isVisible = this.isVisibleSubject.asObservable();

  private target?: L.GeoJSON;


  constructor(private service: GrowlService) { }

  async onClick(
    layerContent: LayerContent,
    _allLayerContents: LayerContent[],
    _info: LayerInfo,
    event: L.LeafletMouseEvent
  ) {
    // reset previous click
    this.target?.resetStyle();

    // init fetch
    this.name = layerContent.name;
    this.fetching = true;
    this.isVisibleSubject.next(true);
    let data = await this.service.fetchAverageWithdrawals(layerContent.geometry);

    // update with fetched
    this.fetching = false;
    this.min = data.minimalWithdrawal;
    this.max = data.maximalWithdrawal;
  
    // highlight
    this.target = event.target;
    let currentStyle = (this.target!.options.style as () => L.PathOptions)();
    this.target!.setStyle({
      ...currentStyle,
      weight: 7,
    });
  }

}
