import { Component, HostListener, inject, model } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  authenticationService: AuthenticationService = inject(AuthenticationService);

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  doShowLoginModal = model<boolean>(false);

  closeModal() {
    this.doShowLoginModal.update(showLoginModal => !showLoginModal);
  }

  async signInWithGoogle() {
    await this.authenticationService.signInWithGoogle();
    this.doShowLoginModal.update(showLogin => !showLogin);
    this.router.navigate(['/profile']);
  }
}
