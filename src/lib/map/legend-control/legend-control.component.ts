import { Component } from '@angular/core';
import { Map2Control } from 'common';
import { Observable } from 'rxjs';
import * as rxjs from "rxjs";

@Component({
  selector: 'lib-legend-control',
  templateUrl: "./legend-control.component.html"
})
export class LegendControlComponent implements Map2Control {
  isVisible = rxjs.of(true);

  legendItems = [
    ["Höchstwert überschritten", "#00008B"],
    ["sehr hoch", "#104E8B"],
    ["hoch", "#1E90FF"],
    ["normal", "#00FF00"],
    ["niedrig", "#FFFF00"],
    ["sehr niedrig", "#CD6839"],
    ["Niedrigswert unterschritten", "#FF0000"],
    ["Keine aktuellen Daten", "#888888"]
  ]
}
