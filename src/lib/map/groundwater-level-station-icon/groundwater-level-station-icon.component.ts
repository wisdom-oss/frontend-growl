import {
  OnChanges,
  SimpleChanges,
  Component,
  OnInit,
  Input,
  ElementRef
} from "@angular/core";

@Component({
  selector: 'lib-groundwater-level-station-icon',
  standalone: false,
  templateUrl: "./groundwater-level-station-icon.component.svg"
})
export class GroundwaterLevelStationIconComponent implements OnChanges {
  @Input() color?: string;
  @Input() backgroundColor?: string;

  constructor(private thisElement: ElementRef<SVGElement>) {}

  update(): void {
    let native = this.thisElement.nativeElement;
    
    if (this.color) {
      let element = native.querySelector("#filler") as SVGPathElement;
      element.style.fill = this.color;
    }

    if (this.backgroundColor) {
      let element = native.querySelector("#background-filler rect") as SVGPathElement;
      element.style.fill = this.backgroundColor;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }
}
