import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA , MatDialogModule} from '@angular/material/dialog';
import { AngularMaterialModule } from '../angular-material.module';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [AngularMaterialModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {}

}
