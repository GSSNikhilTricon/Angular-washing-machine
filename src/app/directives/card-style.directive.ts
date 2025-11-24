import { Directive, ElementRef, Renderer2, HostListener, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appCard]'
})
export class CardStyleDirective implements OnChanges {
  
  @Input() status: 'free' | 'busy' | undefined;

  constructor(private el: ElementRef, private r: Renderer2) {
    this.applyBaseStyles();
  }

  ngOnChanges() {
    if (this.status === 'free') {
      this.r.setStyle(this.el.nativeElement, 'border-left', '5px solid #4CAF50'); // green
      this.r.setStyle(this.el.nativeElement, 'background', '#e9ffe9');
    } else if (this.status === 'busy') {
      this.r.setStyle(this.el.nativeElement, 'border-left', '5px solid #ff5252'); // red
      this.r.setStyle(this.el.nativeElement, 'background', '#ffe9e9');
    }
  }

  private applyBaseStyles() {
    this.r.setStyle(this.el.nativeElement, 'padding', '16px');
    this.r.setStyle(this.el.nativeElement, 'border-radius', '10px');
    this.r.setStyle(this.el.nativeElement, 'background', '#fff');
    this.r.setStyle(this.el.nativeElement, 'box-shadow', '0 2px 10px rgba(0,0,0,0.08)');
    this.r.setStyle(this.el.nativeElement, 'transition', '0.2s ease');
    this.r.setStyle(this.el.nativeElement, 'margin-bottom', '12px');
  }

  

  @HostListener('mouseenter')
  onHover() {
    this.r.setStyle(this.el.nativeElement, 'box-shadow', '0 4px 14px rgba(0,0,0,0.12)');
    this.r.setStyle(this.el.nativeElement, 'transform', 'translateY(-2px)');
  }

  @HostListener('mouseleave')
  onLeave() {
    this.r.setStyle(this.el.nativeElement, 'box-shadow', '0 2px 10px rgba(0,0,0,0.08)');
    this.r.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
  }
}
