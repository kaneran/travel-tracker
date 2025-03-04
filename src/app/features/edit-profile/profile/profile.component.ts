import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country, CountryVisited, Goal, TravelDataService, UserStat, UserStatDetails } from '../../../core/services/travel-data.service';
import { Toast, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  profileForm: FormGroup;
  deletedRecord: AbstractControl<any, any> | undefined;
  userStats: UserStatDetails;
  countries: Country[];
  travelService: TravelDataService = inject(TravelDataService);
  toastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this.travelService.getCountries().then((countries) => {
      this.countries = countries;
    })
    this.profileForm = this.formBuilder.group({
      goals: this.formBuilder.array([])
    });
    this.travelService.getUserStats().then((userStats) => {
      this.userStats = userStats;
      this.updateProfileForm(userStats);
    });
  }

  private updateProfileForm(userStats: UserStatDetails) {
    this.goals.push(this.formBuilder.group({
      action: "",
      quantity: this.formBuilder.control(userStats.countries_goal.quantity, [Validators.required, Validators.min(1)]),
      countryOrPlace: this.formBuilder.control("countries", Validators.required),
      age: this.formBuilder.control(userStats.countries_goal.age, [Validators.required, Validators.min(16)])
    }))

    this.goals.push(this.formBuilder.group({
      action: "",
      quantity: this.formBuilder.control(userStats.places_goal.quantity, [Validators.required, Validators.min(1)]),
      countryOrPlace: this.formBuilder.control("places", Validators.required),
      age: this.formBuilder.control(userStats.places_goal.age, [Validators.required, Validators.min(16)])
    }))
  }

  get goals(): FormArray {
    return this.profileForm.get('goals') as FormArray;
  }

  get formGroup(): FormGroup {
    return this.formBuilder.group({
      action: "",
      quantity: this.formBuilder.control('', [Validators.required, Validators.min(1)]),
      countryOrPlace: this.formBuilder.control('', Validators.required),
      age: this.formBuilder.control('', [Validators.required, Validators.min(16)])
    });
  }

  undoPreviousChange() {
    if (this.deletedRecord != undefined) {
      this.goals.push(this.formBuilder.group({
        action: "",
        quantity: this.formBuilder.control('', [Validators.required, Validators.min(1)]),
        countryOrPlace: this.formBuilder.control('', Validators.required),
        age: this.formBuilder.control('', [Validators.required, Validators.min(16)])
      }))
      this.deletedRecord = undefined;
    }
  }

  region(countryVisited: string): string {
    const alpha = this.countries.find(c => countryVisited === c.name)?.['alpha-2'];
    const result = alpha === undefined ? "" : alpha;
    return result;
  }

  async saveChanges() {
    let response = {} as UserStat;
    response.role = this.userStats.role;
    response.countries_goal = {} as Goal;
    response.places_goal = {} as Goal;
    response.total_no_countries_visited = this.userStats.total_no_countries_visited;
    response.total_no_places_visited = this.userStats.total_no_places_visited;
    response.countries_visited = this.userStats.countries_visited.map(cv => ({ country_name: cv.country_name, date_visited: cv.date_visited, place_visited: cv.place_visited, positive_note: cv.positive_note, region: this.region(cv.country_name) }) as CountryVisited) as CountryVisited[];

    let goals = [...this.profileForm.value.goals];
    goals.forEach(goal => {
      let formGoal = { quantity: goal.quantity, age: goal.age } as Goal;
      if (goal.countryOrPlace == "countries") {
        response.countries_goal = formGoal;
      } else if (goal.countryOrPlace == "places") {
        response.places_goal = formGoal;
      }
    });

    const updatedUserStats = await this.travelService.updateUserStats(response) as UserStatDetails;
    if (updatedUserStats !== undefined) {
      let toast = { type: ToastType.SUCCESS, message: 'Successfully saved.' } as Toast;
      this.toastService.addToast(toast);
      this.goals.clear();
      this.updateProfileForm(updatedUserStats);
    }
  }

  validateInput(goal: any, field: string): boolean {
    return goal.controls[field].status === "VALID";
  }
}
