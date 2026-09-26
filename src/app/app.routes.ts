import { Routes } from '@angular/router';
import { UserForm } from './user-form/user-form';
import { UserDetails } from './user-details/user-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-form',
    pathMatch: 'full'
  },
  {
    path: 'user-form',
    component: UserForm
  },
  {
    path: 'user-details',
    component: UserDetails
  }
];