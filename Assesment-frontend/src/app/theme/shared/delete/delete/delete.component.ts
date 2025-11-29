import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent {
  @Input() message: string = 'AREYOUSUREYOUWANTTODELETETHISITEM';
  @Output() confirmed = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  confirmDelete(choice: boolean) {
    this.confirmed.emit(choice);
    this.activeModal.close();
  }

  cancelDelete() {
    this.activeModal.dismiss();
  }
}
