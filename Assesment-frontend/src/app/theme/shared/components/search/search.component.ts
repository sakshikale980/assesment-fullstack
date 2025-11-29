import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  @Input() searchTerm: string = '';
  @Output() searchChange = new EventEmitter<string>();

  onSearch(){
    this.searchChange.emit(this.searchTerm);
  }
}
