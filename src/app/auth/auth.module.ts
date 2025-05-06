import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthRoutingModule } from './auth.routes';


@NgModule({
    imports:[
        AuthRoutingModule
    ]
})
export class AuthModule {}