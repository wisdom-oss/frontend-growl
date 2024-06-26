import {Component, OnInit} from "@angular/core";
import { Map2Service } from "common";

@Component({
  selector: 'lib-growl',
  templateUrl: "growl.component.html"
})
export class GrowlComponent implements OnInit {
  constructor(private mapService: Map2Service) {}

  ngOnInit(): void {
    this.mapService.fetchAvailableLayers().then(layers => console.log(layers));
  }
}
