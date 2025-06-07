import { Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';
import { HomeComponent } from './features/home/home.component';
import { ViewProfileComponent } from './features/view-profile/view-profile.component';
import { EditProfileComponent } from './features/edit-profile/edit-profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ViewProfileComponent, canActivate: [AuthGuard] },
    { path: 'editprofile', component: EditProfileComponent, canActivate: [AuthGuard] }
];
