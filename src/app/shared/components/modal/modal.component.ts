import { Component, model } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  doShowLoginModal = model<boolean>(false);

  closeModal() {
    this.doShowLoginModal.update(showLoginModal => !showLoginModal);
  }
}
