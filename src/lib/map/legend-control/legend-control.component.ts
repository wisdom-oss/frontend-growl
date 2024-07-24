import { Component } from '@angular/core';
import { Map2Control } from 'common';
import { Observable } from 'rxjs';
import * as rxjs from "rxjs";
import { GrowlService, MeasurementClassification } from '../../growl.service';

type CountRecord = Record<MeasurementClassification, number> & {"null": number};

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
    ["Niedrigstwert unterschritten", "#FF0000"],
    [null, "#888888"]
  ]

  count: Observable<CountRecord>;

  constructor(private growlService: GrowlService) {
    this.count = this.growlService.measurements.pipe(
      rxjs.map(m => {
        let count = Object.fromEntries(
          Object.values(MeasurementClassification).map(v => [v, 0])
        ) as CountRecord;
        count.null = 0;
        
        for (let {classification} of Object.values(m)) {
          let key = "" + classification as keyof CountRecord;
          count[key]++;
        }
    
        console.log(count);
        return count;
      }),
      rxjs.shareReplay(1),
    );
  }
}
