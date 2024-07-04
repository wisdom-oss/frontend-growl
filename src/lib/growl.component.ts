import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef, createComponent } from "@angular/core";
import { Map2Service, LayerConfig } from "common";
import { GroundwaterLevelStationIconComponent } from "./groundwater-level-station-icon/groundwater-level-station-icon.component";
import * as L from "leaflet";

@Component({
  selector: 'lib-growl',
  templateUrl: "growl.component.html"
})
export class GrowlComponent implements OnInit {

  LAYERS: LayerConfig.Input = [
    {
      layer: "groundwater_bodies",
      style: () => {
        return {
          color: "#0088aa",
          weight: 4
        }
      }
    },
    [
      [{ 
        layer: "view_nds_districts", 
        show: false,
        showNames: true,
        style: () => {
          return {
            fillOpacity: 0,
            color: "black",
            weight: 2
          }
        }
      }],
      [{
        layer: "groundwater_measurement_stations",
        marker: (latlng, content) => {
          let component = this.vcr.createComponent(GroundwaterLevelStationIconComponent);
          this.markers[content.name] = component;
          let icon = L.divIcon({
            html: component.location.nativeElement,
            className: "",
            iconSize: [40, 40]
          });
          return L.marker(latlng, {icon});
        }
      }],
      [{
        layer: "water_right_usage_locations",
        show: false
      }],
      [{ 
        layer: 'old_water_right_usage_locations', 
        show: false 
      }]
    ]
  ];

  markers: Record<string, ComponentRef<GroundwaterLevelStationIconComponent>> = {};

  constructor(
    public mapService: Map2Service,
    private vcr: ViewContainerRef
  ) { }

  updateIcons(): void {
    for (let marker of Object.values(this.markers)) {
      marker.instance.color = this.randomColor();
      marker.instance.update();
    }
  }

  randomColor(): string {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
  }

  ngOnInit(): void {
    this.mapService.fetchAvailableLayers().then(layers => console.log(layers));
  }
}
