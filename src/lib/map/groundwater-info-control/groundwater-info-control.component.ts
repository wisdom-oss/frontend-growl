import { Component } from '@angular/core';
import { LayerContent, Map2Control } from 'common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-groundwater-info-control',
  templateUrl: './groundwater-info-control.component.html'
})
export class GroundwaterInfoControlComponent implements Map2Control {

  name?: string;
  key?: string;

  private isVisibleSubject = new BehaviorSubject(false);
  public isVisible = this.isVisibleSubject.asObservable();

  onMouseOver(layerContent: LayerContent): void {
    this.isVisibleSubject.next(true);
    this.name = layerContent.name;
    this.key = layerContent.key;
  }

  onMouseOut(): void {
    this.isVisibleSubject.next(false);
  }

}
