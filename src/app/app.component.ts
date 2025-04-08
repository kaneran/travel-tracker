import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth, GoogleAuthProvider, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { Functions } from '@angular/fire/functions';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { Country } from './core/services/travel-data.service';
import { ToastService } from './core/services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastsComponent } from './shared/components/toasts/toasts.component';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastsComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'travel-tracker';
  auth: Auth = inject(Auth);
  countries$: Country[];
  functions: Functions = inject(Functions);
  doShowLoginModal: boolean = false;

  // constructor(travelDataService: TravelDataService) {

  // }

  // async GetCountries() {
  //   travelDataService.getCountries().then(countries => {
  //     this.countries$ = countries as Country[];
  //     console.log(this.countries$);
  //   });

  // }

  // async UpdatePlacesVisited() {
  //   await updatePlacesVisited();
  // }
}
