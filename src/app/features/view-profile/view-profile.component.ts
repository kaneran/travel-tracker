import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { TravelDataService, UserStatDetails } from '../../core/services/travel-data.service';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [ProgressBarComponent, CommonModule],
  templateUrl: './view-profile.component.html',
  // template: getTemplate(),
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  countriesGoalTitle: string = 'Countries Goal';
  placesGoalTitle: string = 'Places Goal';
  placesGoalTitle2: string = 'abc';
  userStats: UserStatDetails;
  template: any;
  photoURL: string = '';


  constructor(travelDataService: TravelDataService) {
    console.log(this.auth.currentUser);
    //property - description
    //photoUrl - profile picture
    //displayName - Profile name
    travelDataService.getUserStats().then(data => {
      this.userStats = data as UserStatDetails;
      console.log(this.userStats);
    });
  }

  getPhotoURL() {
    if (this.photoURL == '')
      this.photoURL = this.auth.currentUser?.photoURL || '';
    return this.photoURL;
  }

  editProfile() {
    console.log("You clicked me");
    this.router.navigate(['/editprofile']);
  }


}
function getTemplate(): string | undefined {
  return ` <button (click)="template=test">Test</button>
    <ng-template #test>
        <app-progress-bar [score]="45" [title]="placesGoalTitle2"></app-progress-bar>
    </ng-template>
    <ng-container [ngTemplateOutlet]="template"></ng-container>`
}

