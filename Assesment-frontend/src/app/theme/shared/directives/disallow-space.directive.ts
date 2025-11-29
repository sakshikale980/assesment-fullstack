import { Directive, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'input[disallow-spaces]',
  host: {
    '(keyup)': 'onKeyup($event)'
}
})
  
export class DisallowSpaceDirective {

  constructor(
    private renderer: Renderer2,
) { }

onKeyup(event: KeyboardEvent) {
    let value = (<HTMLInputElement>event.target).value.replace(/ /g, '');
    this.renderer.setProperty(<HTMLInputElement>event.target, 'value', value);
}

}


