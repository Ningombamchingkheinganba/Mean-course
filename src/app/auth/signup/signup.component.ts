import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../../angular-material.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, AngularMaterialModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authStatusSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
