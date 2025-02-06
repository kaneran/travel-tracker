import { Component, inject } from '@angular/core';
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
  isLoggedIn: boolean = false;

  async Login() {
    if (await this.authenticationService.signInWithGoogle() !== undefined) {
      this.isLoggedIn = true;
      this.router.navigate(['/profile']);
    }
  }

  async Logout() {
    await this.authenticationService.firebaseSignOut();
    this.router.navigate(['/home']);
    this.isLoggedIn = false;
  }

}
