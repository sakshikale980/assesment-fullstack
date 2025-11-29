import { Directive, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[MiddlespacesAllow]',
  standalone: true
})
export class MiddlespacesAllowDirective {

  constructor(private renderer: Renderer2) { }

  @HostListener('keyup', ['$event'])
  // onKeyup(event: KeyboardEvent) {
  //   let value = (<HTMLInputElement>event.target).value.trim().replace(/\s\s+/g, ' ');
  //   this.renderer.setProperty(event.target, 'value', value);
  // }
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
  if (event.target instanceof HTMLInputElement) {
    // Replace consecutive spaces with a single space
    const processedValue = event.target.value.replace(/\s\s+/g, ' ');

    // Set the processed value to the input element
    this.renderer.setProperty(event.target, 'value', processedValue);
  }
}
}
