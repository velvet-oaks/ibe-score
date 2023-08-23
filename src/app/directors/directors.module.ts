import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// Components
import { DirectorsComponent } from './directors.component';

@NgModule({
	declarations: [DirectorsComponent, ],
	imports: [
		CommonModule,
		MatSnackBarModule,
		MatFormFieldModule,
		MatCardModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
    MatDialogModule,
		MatIconModule
	],
	exports: []
})
export class DirectorsModule {}
