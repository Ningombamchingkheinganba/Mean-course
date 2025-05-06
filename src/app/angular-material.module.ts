import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';



@NgModule({
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule, 
        MatCardModule,  
        MatProgressSpinnerModule, 
        MatIconModule, 
        MatToolbarModule, 
        MatExpansionModule, 
        MatPaginatorModule,
        MatDialogModule
    ]
})

export class AngularMaterialModule { }