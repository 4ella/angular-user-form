import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  signupForm: FormGroup;
  pincodeError = '';
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-z]+$/)
          ]
        ],

        lastName: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-z]+$/)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?:[1-9][0-9]{9}|\+[1-9][0-9]{12})$/
            )
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@#$&!]).{6,}$/
            )
          ]
        ],

        repeatPassword: [
          '',
          Validators.required
        ],

        pincode: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{6}$/)
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {

    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;

    if (password !== repeatPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  submitForm() {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.pincodeError = '';
    this.serverError = '';

    const user = this.signupForm.value;

    this.userService.registerUser(user).subscribe({

      next: (response) => {

        this.router.navigate([
          '/registration-confirmation',
          response.userId
        ]);

      },

      error: (error) => {

        if (error.status === 400) {
          this.pincodeError = error.error.message;
        }
        else if (error.status === 409) {
          this.serverError = 'Email already registered';
        }
        else {
          this.serverError = 'Registration failed';
        }

      }

    });
  }
}