import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirst]',
  standalone: true
})
export class CapitalizeFirstDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const input = this.el.nativeElement;
    input.value = this.capitalizeEachWord(input.value);
  }

  private capitalizeEachWord(value: string): string {
    if (!value) return '';
    
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
}
