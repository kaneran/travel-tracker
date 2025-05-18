import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  router: Router = inject(Router);

  ngOnInit() {
    this.authenticationService.signInWithEmailLink().then((res) => {
      if (res !== undefined) {
        this.router.navigate(['/profile']);
      }
    });
  }
}
