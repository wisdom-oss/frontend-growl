import { Component } from '@angular/core';
import { LayerContent, Map2Control } from 'common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-county-info-control',
  templateUrl: './county-info-control.component.html'
})
export class CountyInfoControlComponent implements Map2Control {

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
