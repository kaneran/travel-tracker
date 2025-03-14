import { inject, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { connectFunctionsEmulator, Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { Toast, ToastService, ToastType } from './toast.service';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { getAuth } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class TravelDataService {


  userStatsResponse: UserStatDetails
  userStats: BehaviorSubject<any>
  app: FirebaseApp = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  toastService: ToastService = inject(ToastService);


  constructor() {
  }

  async getUserStats(ignoreCacheCheck: boolean = false) {
    if (this.userStatsResponse == undefined || ignoreCacheCheck) {
      const data: UserAPI = { function_name: "getUserStats", payload: null } as UserAPI;
      const response = await this.invokeUserAPI(data) as UserStat;
      const countriesVisited: CountryVisitedDetail[] = await this.getCountriesVisited(response);
      const userStatDetails: UserStatDetails = {
        total_no_countries_visited: response.total_no_countries_visited,
        total_no_places_visited: response.total_no_places_visited, countries_visited: countriesVisited, role: response.role,
        countries_goal: response.countries_goal, places_goal: response.places_goal, places_goal_estimate: response.places_goal_estimate,
        countries_goal_estimate: response.countries_goal_estimate, best_year_streak: response.best_year_streak
      }

      this.userStatsResponse = userStatDetails;
      // this.userStats = new BehaviorSubject(response);
    }
    return this.userStatsResponse;
    // return this.userStats.asObservable();;
  }

  async getCountriesVisited(response: UserStat): Promise<CountryVisitedDetail[]> {
    const countries = await this.getCountries();
    const countriesVisited: CountryVisitedDetail[] = [];
    console.log(response.countries_visited);
    console.log(countries);
    response.countries_visited.forEach(countryVisited => {
      let countryVisitedDetail = {} as CountryVisitedDetail;
      const country = countries.find(country => country.name === countryVisited.country_name);
      if (country !== undefined) {
        countryVisitedDetail.country_name = countryVisited.country_name;
        countryVisitedDetail.place_visited = countryVisited.place_visited;
        countryVisitedDetail.date_visited = countryVisited.date_visited;
        countryVisitedDetail.positive_note = countryVisited.positive_note;
        countryVisitedDetail.alpha2 = country['alpha-2'].toLowerCase();
        countriesVisited.push(countryVisitedDetail);
      }
    });
    //Mock data for now, so I can amend the layout accordingly
    // countriesVisited.push({ country: countries.find(c => c.name === "Portugal"), alpha2: 'pt', date_visited: '2024-05-31' } as CountryVisitedDetail)
    // countriesVisited.push({ country: countries.find(c => c.name === "United Arab Emirates"), alpha2: 'ae', date_visited: '2024-05-31' } as CountryVisitedDetail)
    // countriesVisited.push({ country: countries.find(c => c.name === "India"), alpha2: 'in', date_visited: '2024-05-31' } as CountryVisitedDetail)
    return countriesVisited;
  }

  async getCountries(): Promise<Country[]> {
    //let countries: Country[] = [];
    let countriesCache = localStorage.getItem("countries");
    if (countriesCache == null) {
      const data: UserAPI = { function_name: "getCountries", payload: null };
      const countries$ = await this.invokeUserAPI(data) as Country[];
      localStorage.setItem("countries", JSON.stringify(countries$));
      return countries$;
    } else {
      return JSON.parse(countriesCache);
    }
  }

  async updateUserStats(userStat: UserStat) {
    // const userStat = { total_no_countries_visited: 0, total_no_places_visited: 0, countries_visited: [{ country_name: "Dubai", date_visted: "2023-10-29", positive_note: "Architecture, night life" }], goals: [] };
    const data: UserAPI = { function_name: "updateUserStats", payload: userStat };
    const updatedUserStat = await this.invokeUserAPI(data);
    this.userStatsResponse = updatedUserStat as UserStatDetails;
    return updatedUserStat;
  }

  async invokeUserAPI<T>(data: UserAPI): Promise<T | undefined> {
    //const { httpsCallable, getFunctions } =  import('firebase/functions');
    const functions: Functions = getFunctions();
    try {
      if (!this.auth.currentUser) {
        return;
      }
      console.log("Execute function " + data.function_name);
      connectFunctionsEmulator(functions, 'localhost', 5001);
      const res = await httpsCallable(functions, 'invokeUserAPI')(data);
      return res.data as T;
    } catch (error) {
      console.log(error);
      let toast = { message: "Something went wrong", type: ToastType.ERROR } as Toast;
      this.toastService.addToast(toast);
      return;
    }
  }

  async getRegion(countryVisited: string) {
    const countries = await this.getCountries();
    const alpha = countries.find(c => countryVisited === c.name)?.['alpha-2'];
    const result = alpha === undefined ? "" : alpha;
    return result;
  }

}

export interface UserStat {
  total_no_countries_visited: number,
  total_no_places_visited: number,
  countries_visited: CountryVisited[],
  places_goal: Goal,
  countries_goal: Goal,
  role: string,
  best_year_streak: number,
  countries_goal_estimate: string,
  places_goal_estimate: string
}

export interface CountryVisited {
  country_name: string,
  place_visited: string,
  date_visited: string,
  region: string,
  positive_note: string
}

interface CountryVisitedDetail {
  country_name: string,
  date_visited: string,
  place_visited: string,
  positive_note: string,
  alpha2: string
}

export interface UserStatDetails {
  total_no_countries_visited: number,
  total_no_places_visited: number,
  countries_visited: CountryVisitedDetail[],
  countries_goal: Goal,
  places_goal: Goal,
  role: string,
  best_year_streak: number,
  countries_goal_estimate: string,
  places_goal_estimate: string
}

export interface Goal {
  quantity: number,
  age: number
}

export interface Country {
  'alpha-2': string,
  alpha3: string,
  intermediateRegion: string,
  name: string,
  region: string,
  subRegion: string
}

export interface UserAPI {
  function_name: string,
  payload: any
}

