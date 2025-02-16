import { Component, inject, OnInit } from '@angular/core';
import { Country, CountryVisited, TravelDataService, UserStat, UserStatDetails } from '../../../core/services/travel-data.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { Toast, ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-places-visited',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './places-visited.component.html',
  styleUrl: './places-visited.component.scss'
})
export class PlacesVisitedComponent implements OnInit {
  userStats: UserStatDetails;
  placesVisitedForm: FormGroup;
  countries: Country[];
  deletedRecord: AbstractControl<any, any> | undefined;
  travelService: TravelDataService = inject(TravelDataService);
  formBuilder: FormBuilder = inject(FormBuilder);
  toastService: ToastService = inject(ToastService);


  ngOnInit(): void {
    this.travelService.getCountries().then((countries) => {
      this.countries = countries;
    })

    this.placesVisitedForm = this.formBuilder.group({
      placesVisited: this.formBuilder.array([])
    })
    this.travelService.getUserStats().then((userStats) => {
      this.userStats = userStats;
      this.updatePlacesVisitedForm(userStats);
    });
  }

  private updatePlacesVisitedForm(userStats: UserStatDetails) {
    const placesVisited = this.placesVisited;
    userStats.countries_visited.forEach(country_visited => {
      placesVisited.push(this.formBuilder.group({
        action: "",
        date_visited: this.formBuilder.control(country_visited.date_visited, [Validators.required, Validators.pattern("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]")]),
        country_visited: this.formBuilder.control(country_visited.country_name, Validators.required),
        place_visited: this.formBuilder.control(country_visited.place_visited, Validators.required)
      }));
    });
  }

  get placesVisited(): FormArray {
    return this.placesVisitedForm.get('placesVisited') as FormArray;
  }

  get formGroup(): FormGroup {
    return this.formBuilder.group({
      action: "",
      date_visited: this.formBuilder.control('', [Validators.required, Validators.pattern("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]")]),
      country_visited: this.formBuilder.control('', Validators.required),
      place_visited: this.formBuilder.control('', Validators.required)
    });
  }

  addRecord() {
    this.placesVisited.push(this.formGroup)
  }

  deleteRecord(index: number) {
    this.deletedRecord = this.placesVisited.at(index);
    this.placesVisited.removeAt(index);
  }

  undoPreviousChange() {
    if (this.deletedRecord != undefined) {
      console.log(this.deletedRecord);
      this.placesVisited.push(this.formBuilder.group({
        action: "",
        date_visited: this.formBuilder.control(this.deletedRecord.value.date_visited, [Validators.required, Validators.pattern("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]")]),
        country_visited: this.formBuilder.control(this.deletedRecord.value.country_visited, Validators.required),
        place_visited: this.formBuilder.control(this.deletedRecord.value.place_visited, Validators.required)
      }))
      this.deletedRecord = undefined;
    }
  }

  async saveChanges() {
    console.log(this.placesVisitedForm.value);
    let response = {} as UserStat;
    response.role = this.userStats.role;
    response.goals = this.userStats.goals;
    response.total_no_countries_visited = this.userStats.total_no_countries_visited;
    response.total_no_places_visited = this.userStats.total_no_places_visited;
    let placesVisited = [...this.placesVisitedForm.value.placesVisited] as PlaceVisited[];
    // let countriesVisited: CountryVisited[] = [];
    // placesVisited.forEach(async (pv) => {
    //   let region = await this.travelService.getRegion(pv.country_visited);
    //   let countryVisited = {
    //     country_name: pv.country_visited,
    //     date_visited: pv.date_visited,
    //     place_visited: pv.place_visited,
    //     region,
    //     positive_note: ""
    //   } as CountryVisited;
    //   countriesVisited.push(countryVisited);
    // })
    let countriesVisited = placesVisited.map(pv => ({
      country_name: pv.country_visited,
      date_visited: pv.date_visited,
      place_visited: pv.place_visited,
      region: this.region(pv.country_visited),
      positive_note: ""
    } as CountryVisited)) as CountryVisited[];

    response.countries_visited = countriesVisited;

    const updatedUserStats = await this.travelService.updateUserStats(response) as UserStatDetails;
    if (updatedUserStats !== undefined) {
      let toast = { type: ToastType.SUCCESS, message: 'Successfully saved.' } as Toast;
      this.toastService.addToast(toast);
      this.placesVisited.clear();
      this.updatePlacesVisitedForm(updatedUserStats);
    }
  }

  region(countryVisited: string): string {
    const alpha = this.countries.find(c => countryVisited === c.name)?.['alpha-2'];
    const result = alpha === undefined ? "" : alpha;
    return result;
  }

  validateInput(placeVisited: any, field: string): boolean {
    return placeVisited.controls[field].status === "VALID";
  }
}

interface PlaceVisited {
  country_visited: string,
  date_visited: string,
  place_visited: string
}

