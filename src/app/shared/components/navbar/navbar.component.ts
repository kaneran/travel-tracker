import { Component, inject, model, } from '@angular/core';
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

  doShowLoginModal = model<boolean>(false);

  async Login() {
    if (this.auth.currentUser !== null) {
      this.router.navigate(['/profile']);
    } else {
      this.doShowLoginModal.update(showLogin => !showLogin);
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
