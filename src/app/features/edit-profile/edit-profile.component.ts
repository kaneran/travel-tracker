import { Component } from '@angular/core';
import { TravelDataService } from '../../core/services/travel-data.service';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { IPageTab, PageTabsComponent } from '../../shared/components/page-tabs/page-tabs.component';
import { PlacesVisitedComponent } from './places-visited/places-visited.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, PageTabsComponent, PlacesVisitedComponent, ProfileComponent],
  templateUrl: './edit-profile.component.html',
  // template: `
  //  <div class="tab">
  //   <button class="tablinks" (click)="template=tab1" [class.active]="template == tab1">Places Visited!</button>
  //   <button class="tablinks" (click)="template=tab2" [class.active]="template == tab2">Profile!</button>
  // </div>
  // <ng-container [ngTemplateOutlet]="template"></ng-container>
  //   <ng-template #tab1>Tab 1 selected</ng-template>
  //   <ng-template #tab2>Tab 2 selected</ng-template>

  // `,
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  buttonStates: ButtonState[] = [];
  tabs: IPageTab[] = [{ name: 'Places Visited', component: '<app-test1/>' }, { name: 'Profile', component: '<app-test2/>' }]
  tabSelected: string;


  handleTabSelected(tabSelected: string) {
    this.tabSelected = tabSelected;

  }

  constructor(travelDataService: TravelDataService) {
    //console.log(this.auth.currentUser);
    //property - description
    //photoUrl - profile picture
    //displayName - Profile name
    //travelDataService.getUserStats().subscribe((x) => console.log(x));
    // this.initButtons();
  }

  handleButtonClick(buttonName: string) {
    console.log(buttonName);
    this.buttonStates.find(b => b.name == buttonName)
  }

  // initButtons() {
  //   this.buttons.forEach(btn => {
  //     const buttonState = { name: btn, isActive: false } as ButtonState;
  //     this.buttonStates.push(buttonState);
  //   })
  // }
}

interface ButtonState {
  name: string,
  isActive: boolean
}
