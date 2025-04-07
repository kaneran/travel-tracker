import { Component, inject, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  authenticationService: AuthenticationService = inject(AuthenticationService);
  doShowDropdown: boolean = false;

  @Input() doShowLoginModal: boolean = false;

  async Login() {
    if (this.auth.currentUser !== null) {
      this.router.navigate(['/profile']);
    } else {
      this.doShowLoginModal = !this.doShowLoginModal;
      await this.authenticationService.signInWithGoogle() !== undefined
      this.router.navigate(['/profile']);
    }
  }

  async Logout() {
    await this.authenticationService.firebaseSignOut();
    this.router.navigate(['/home']);
  }

  updateDropdownToggle() {
    this.doShowDropdown = !this.doShowDropdown;
  }

}
