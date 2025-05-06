import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../signup/auth.service';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from '../../angular-material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, AngularMaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
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

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
