import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country, CountryVisited, Goal, TravelDataService, UserStat, UserStatDetails } from '../../../core/services/travel-data.service';

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
    userStats.goals.forEach(goal => {
      this.goals.push(this.formBuilder.group({
        action: "",
        quantity: this.formBuilder.control(goal.quantity, [Validators.required, Validators.min(1)]),
        countryOrPlace: this.formBuilder.control(goal.countryOrPlace, Validators.required),
        age: this.formBuilder.control(goal.age, [Validators.required, Validators.min(16)])
      }));
    });
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

  addRecord() {
    this.goals.push(this.formGroup)
  }

  deleteRecord(index: number) {
    this.deletedRecord = this.goals.at(index);
    this.goals.removeAt(index);
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
    response.total_no_countries_visited = this.userStats.total_no_countries_visited;
    response.total_no_places_visited = this.userStats.total_no_places_visited;
    response.countries_visited = this.userStats.countries_visited.map(cv => ({ country_name: cv.country_name, date_visited: cv.date_visited, place_visited: cv.place_visited, positive_note: cv.positive_note, region: this.region(cv.country_name) }) as CountryVisited) as CountryVisited[];
    let goals = [...this.profileForm.value.goals] as Goal[];
    goals = goals.map(goal => ({ age: goal.age, countryOrPlace: goal.countryOrPlace, quantity: goal.quantity }) as Goal);
    response.goals = goals;

    const updatedUserStats = await this.travelService.updateUserStats(response) as UserStatDetails;
    if (updatedUserStats !== undefined) {
      this.goals.clear();
      this.updateProfileForm(updatedUserStats);
    }
  }
}
