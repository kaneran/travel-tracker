import { Component, HostListener, inject, model } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  authenticationService: AuthenticationService = inject(AuthenticationService);
  email: string = "";
  emailSent: boolean = false;

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

  async handleSend() {
    console.log(this.email);
    const url = window.location.href;
    console.log(url);
    this.emailSent = await this.authenticationService.sendPasswordlessEmail(this.email, url);
  }

  async signInWithGoogle() {
    await this.authenticationService.signInWithGoogle();
    this.doShowLoginModal.update(showLogin => !showLogin);
    this.router.navigate(['/profile']);
  }

  async signInAsGuest() {
    await this.authenticationService.signInAsGuest();
    this.doShowLoginModal.update(showLogin => !showLogin);
    this.router.navigate(['/profile']);

  }
}
