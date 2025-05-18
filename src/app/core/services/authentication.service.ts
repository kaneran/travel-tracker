import { inject, Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { getAuth, GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup, signOut, User, UserCredential } from 'firebase/auth';
import { connectFunctionsEmulator, Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { Toast, ToastService, ToastType } from './toast.service';
import { TravelDataService } from './travel-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  app: FirebaseApp = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  travelDataService: TravelDataService = inject(TravelDataService);
  toastService: ToastService = inject(ToastService);

  async sendPasswordlessEmail(email: string, url: string) {
    const actionCodeSettings = {
      url: url,
      handleCodeInApp: true
    };
    try {
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return true;
    } catch (err) {
      console.log(err);
      const toast = { type: ToastType.ERROR, message: "Something went wrong" } as Toast;
      this.toastService.addToast(toast);
      return false;
    }
  }

  async signInWithEmailLink() {
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        const credential = signInWithEmailLink(this.auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        return await this.loginHandler(credential);
      }
    } return;
  }

  async signInWithGoogle() {
    const credential = signInWithPopup(this.auth, new GoogleAuthProvider());
    //const credential = await signInWithRedirect(auth, new GoogleAuthProvider());
    return await this.loginHandler(credential);
  }

  async loginHandler(promise: Promise<UserCredential>) {
    let res: UserCredential = {} as UserCredential;
    try {
      res = await promise;
      const toast = { type: ToastType.SUCCESS, message: "Successfully logged in" } as Toast;
      this.toastService.addToast(toast);
      const data: UserAPI = { function_name: "getUserStats", payload: null } as UserAPI;
      await this.travelDataService.invokeUserAPI(data);
      return res;
    } catch (err) {
      console.log(err);
      const toast = { type: ToastType.ERROR, message: "Something went wrong" } as Toast;
      this.toastService.addToast(toast);
      return;
    }
  }

  async firebaseSignOut() {
    await signOut(this.auth).then(() => console.log("sign out successful"));
  }

}

export interface UserAPI {
  function_name: string,
  payload: any
}
