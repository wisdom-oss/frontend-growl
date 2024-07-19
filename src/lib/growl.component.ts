import {
  createComponent,
  ViewChild,
  Component,
  OnInit,
  ComponentRef,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Map2Component, LayerConfig, Map2Service, LayerKey, LayoutService, ResizeDirective } from "common";
import dayjs from "dayjs";

import * as L from "leaflet";

import {
  GroundwaterLevelStationIconComponent
}
  from "./map/groundwater-level-station-icon/groundwater-level-station-icon.component";
import { GrowlService, MeasurementClassification, MeasurementRecord } from "./growl.service";
import { combineLatest, Subscription } from "rxjs";
import { StationInfoControlComponent } from "./map/station-info-control/station-info-control.component";
import { GroundwaterInfoControlComponent } from "./map/groundwater-info-control/groundwater-info-control.component";
import { CountyInfoControlComponent } from "./map/county-info-control/county-info-control.component";
import { WithdrawalInfoControlComponent } from "./map/withdrawal-info-control/withdrawal-info-control.component";

@Component({
  selector: 'lib-growl',
  templateUrl: "growl.component.html"
})
export class GrowlComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(Map2Component) map?: Map2Component;

  private GROUNDWATER_BODIES: LayerConfig.ExpandedDescriptor = {
    layer: "groundwater_bodies",
    control: [
      [GroundwaterInfoControlComponent, "bottomleft"],
      [WithdrawalInfoControlComponent, "bottomright"]
    ],
    style: () => {
      return {
        color: "#0088aa",
        weight: 2
      }
    }
  }

  private NDS_DISTRICTS: LayerConfig.ExpandedDescriptor = {
    layer: "view_nds_districts",
    show: false,
    control: [CountyInfoControlComponent, "bottomleft"],
    style: () => {
      return {
        fillOpacity: 0,
        color: "black",
        weight: 2
      }
    }
  }

  private GROUNDWATER_MEASUREMENT_STATIONS: LayerConfig.ExpandedDescriptor = {
    layer: "groundwater_measurement_stations",
    cluster: false,
    control: [StationInfoControlComponent, "bottomleft"],
    marker: (latlng, content) => {
      let component = this.vcr.createComponent(GroundwaterLevelStationIconComponent);
      component.instance.color = this.classificationColor(null);
      component.instance.update();
      this.markers[content.key] = component;
      let icon = L.divIcon({
        html: component.location.nativeElement,
        className: "",
        iconSize: [40, 40]
      });
      return L.marker(latlng, { icon });
    }
  };

  LAYERS: LayerConfig.Input = [
    this.GROUNDWATER_BODIES,
    [
      [this.NDS_DISTRICTS],
      [this.GROUNDWATER_MEASUREMENT_STATIONS],
      [{ layer: "water_right_usage_locations", show: false }],
      [{ layer: 'old_water_right_usage_locations', show: false }]
    ]
  ];

  height = (window.innerHeight - 300) + "px";

  markers: Record<LayerKey, ComponentRef<GroundwaterLevelStationIconComponent>> = {};
  measurements?: MeasurementRecord;

  private subscriptions: Subscription[] = [];

  dateOffset = 0;
  date = dayjs();

  @ViewChild(ResizeDirective) resizeCardNonMap?: ResizeDirective;

  constructor(
    private service: GrowlService,
    public mapService: Map2Service,
    private vcr: ViewContainerRef,
    private layoutService: LayoutService
  ) { }

  updateIcons(): void {
    for (let marker of Object.values(this.markers)) {
      marker.instance.color = this.randomColor();
      marker.instance.update();
    }
  }

  classificationColor(classification: MeasurementClassification | null): string {
    switch (classification) {
      case MeasurementClassification.MAX_EXCEEDED: return "#00008B"; // #000080
      case MeasurementClassification.VERY_HIGH: return "#104E8B"; // #00008B
      case MeasurementClassification.HIGH: return "#1E90FF"; // #0000FF
      case MeasurementClassification.NORMAL: return "#00FF00"; // #1E90FF
      case MeasurementClassification.LOW: return "#FFFF00"; // #ADD8E6
      case MeasurementClassification.VERY_LOW: return "#CD6839"; // #FFA07A
      case MeasurementClassification.MIN_UNDERSHOT: return "#FF0000"; // #FF4500
      case null: return "#888888";
    }
  }

  onDateUpdate() {
    this.date = dayjs()
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0)
      .subtract(this.dateOffset, 'days');
    this.service.fetchMeasurementClassifications(this.date.toDate());
  }

  randomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
  }

  private fitMap() {
    this.subscriptions.push(combineLatest([
      this.layoutService.layout,
      this.resizeCardNonMap!.resize

    ]).subscribe(([{main}, cardNonMap]) => {
      // this value is definitely not real
      if (cardNonMap.height == 0) return;

      let pads = 4 * 0.75 * this.layoutService.rem;
      let restHeight = main!.height - (cardNonMap.height + pads);
      console.log({ main, cardNonMap, pads });
      this.height = restHeight + "px";
    }));
  }

  ngOnInit(): void {
    this.mapService.fetchAvailableLayers().then(layers => console.log(layers));
    this.service.fetchMeasurementClassifications().then(res => console.log(res));
    this.subscriptions.push(this.layoutService.layout.subscribe(layout => console.log(layout)));
  }

  async ngAfterViewInit(): Promise<void> {
    this.fitMap();
    let map = this.map!;
    await map.map;
    this.subscriptions.push(this.service.measurement.subscribe(
      data => {
        this.measurements = data;
        for (let [key, componentRef] of Object.entries(this.markers)) {
          componentRef.instance.color = this.classificationColor(
            data[key]?.classification ?? null
          );
          componentRef.instance.update();
        }
      }
    ));
  }

  ngOnDestroy(): void {
    for (let component of Object.values(this.markers)) component.destroy();
    for (let sub of this.subscriptions) sub.unsubscribe();
  }
}
