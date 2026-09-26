import { Routes } from '@angular/router';
import { Signup } from './signup/signup';
import { RegistrationConfirmation } from './registration-confirmation/registration-confirmation';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  },

  {
    path: 'signup',
    component: Signup
  },

  {
    path: 'registration-confirmation/:id',
    component: RegistrationConfirmation
  }

];