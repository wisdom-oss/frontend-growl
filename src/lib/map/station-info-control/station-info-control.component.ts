import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayerContent, LayerInfo, Map2Control } from 'common';
import { LeafletMouseEvent } from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GrowlService, MeasurementRecord } from '../../growl.service';

@Component({
  selector: 'lib-station-info-control',
  templateUrl: './station-info-control.component.html',
  styles: ["th { color: inherit; padding-right: 1em }"]
})
export class StationInfoControlComponent implements Map2Control, OnInit, OnDestroy {

  layerContent?: LayerContent;
  layerInfo?: LayerInfo;

  private isVisibleSubject = new BehaviorSubject(false);
  public isVisible = this.isVisibleSubject.asObservable();

  private dataSubscription?: Subscription;
  public data?: MeasurementRecord;

  constructor(private service: GrowlService) {}

  onMouseOver(
    layerContent: LayerContent, 
    allLayerContents: LayerContent[], 
    info: LayerInfo, 
    event: LeafletMouseEvent
  ): void {
    this.layerContent = layerContent;
    this.layerInfo = info;
    this.isVisibleSubject.next(true);
  }

  onMouseOut(
    layerContent: LayerContent, 
    allLayerContents: LayerContent[], 
    info: LayerInfo, 
    event: LeafletMouseEvent
  ): void {
    this.isVisibleSubject.next(false);
  }

  ngOnInit(): void {
    this.dataSubscription = this.service.measurement.subscribe(
      data => this.data = data
    );
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }
}
