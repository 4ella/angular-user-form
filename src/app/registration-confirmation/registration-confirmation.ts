import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user';

@Component({
  selector: 'app-registration-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-confirmation.html',
  styleUrl: './registration-confirmation.css'
})
export class RegistrationConfirmation implements OnInit {

  user: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.userService.getUser(id).subscribe({

      next: (data) => {
        this.user = data;
      },

      error: (error) => {
        console.log(error);
      }

    });
  }
}