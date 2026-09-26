import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-details',
  imports: [MatCardModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails {

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';

  constructor(private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {

      this.firstName = params['fName'];
      this.lastName = params['lName'];
      this.email = params['email'];
      this.phoneNumber = params['phone'];

    });

  }
}