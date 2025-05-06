import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';


@NgModule({
    imports:[
        RouterLink,
        RouterLinkActive
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterLink, 
        RouterLinkActive,
    ]
})
export class PostModule {}