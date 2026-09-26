import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';

  constructor(private router: Router) {}

  submitForm(form: any) {

    if (form.valid) {

      this.router.navigate(['/user-details'], {
        queryParams: {
          fName: this.firstName,
          lName: this.lastName,
          email: this.email,
          phone: this.phoneNumber
        }
      });

    }
  }
}