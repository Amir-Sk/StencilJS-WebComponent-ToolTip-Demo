import { Component, Prop, h, Host, ComponentInterface, State } from '@stencil/core';

@Component({
  tag: 'wc-tooltip',
  styleUrl: 'tooltip.css',
  shadow: true,
})
export class NnTooltip implements ComponentInterface {
  @Prop() iden: string;
  @State() hidden: boolean = true;
  targetElement: HTMLElement;
  toolTipBox: HTMLElement;

  componentWillLoad(): Promise<void> | void {
    this.targetElement = document.getElementById(this.iden);
    this.modifyDom();
  }

  modifyDom(): void {
    if (this.targetElement) {
      this.targetElement.addEventListener('mouseenter', () => {
        this.turnToolTipOn(this.targetElement);
      });
      this.targetElement.addEventListener('mouseleave', () => {
        this.turnToolTipOff();
      });
    } else {
      console.error("Couldn't find pointed element.");
    }
  }

  verifyMeasurementsAndModifyIfNeeded = (hoveredOn: HTMLElement) => {
    let measurements = hoveredOn.getBoundingClientRect();
    const style = this.toolTipBox.style;
    let left = measurements.left + (measurements.width / 2);
    if (left < 0) {
      style.left = '0 px';
      style.marginLeft = '0 px';
    } else {
      style.left = left + 'px';
      style.marginLeft = this.toolTipBox.offsetWidth + 'px';
    }
    style.top = measurements.top + measurements.height + 'px';
  };

  turnToolTipOn = (hoveredOn: HTMLElement): void => {
    this.verifyMeasurementsAndModifyIfNeeded(hoveredOn);
    this.hidden = false;
  };

  turnToolTipOff = () => {
    this.hidden = true;
  };

  render(): HTMLNnTooltipElement {
    return (
      <Host>
        <div ref={ el => this.toolTipBox = el } class={{'custom-tooltip': !this.hidden, 'custom-tooltip hidden': this.hidden }}>
          <slot />
        </div>
      </Host>
    );
  }
}
