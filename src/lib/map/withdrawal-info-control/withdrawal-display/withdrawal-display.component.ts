import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-withdrawal-display',
  templateUrl: "./withdrawal-display.component.svg"
})
export class WithdrawalDisplayComponent implements AfterViewInit, OnChanges {

  @Input("top") top = 0;
  @Input("bottom") bottom = 0;
  @Input("suffix") suffix = "";

  private fontFamily = "Consolas, monospace";

  private resolve!: Function;
  private barrier = new Promise(resolve => this.resolve = resolve);

  constructor(private thisElement: ElementRef<SVGElement>) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.barrier;

    let native = this.thisElement.nativeElement;
    console.log(native);

    let width = Math.ceil(Math.max(Math.log10(this.top), Math.log10(this.bottom)));
    let format = (value: number) => {
      return String(Math.floor(value)).padStart(width, "0") + this.suffix;
    }
  
    let topElement = native.querySelector("#top-val text") as SVGTextElement;
    topElement.style.fontFamily = this.fontFamily;
    topElement.innerHTML = format(this.top);

    let bottomElement = native.querySelector("#bottom-val text") as SVGTextElement;
    bottomElement.style.fontFamily = this.fontFamily
    bottomElement.innerHTML = format(this.bottom);
  }

  ngAfterViewInit(): void {
    this.resolve();
    let svg = this.thisElement.nativeElement.querySelector("svg") as SVGElement;
    svg.style.width = "fit-content";
    svg.style.overflow = "visible";
    svg.style.paddingLeft = "2rem";
    svg.style.paddingRight = "2rem";
  }

}
