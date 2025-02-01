import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';

//{"projectId":"traveltracker-4e827","appId":"1:88536642338:web:6c679aa40318de72bb2b7b","storageBucket":"traveltracker-4e827.appspot.com","apiKey":"AIzaSyBjSX2LUOJt9ef3_44b_UYJm4AihIXiGog","authDomain":"traveltracker-4e827.firebaseapp.com","messagingSenderId":"88536642338","measurementId":"G-L1ETXT48RX"}
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFunctions(() => getFunctions())]
};
