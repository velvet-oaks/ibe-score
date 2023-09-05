import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { response } from 'express';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
	AbstractControl,
	FormBuilder,
	Validators,
	ValidatorFn,
	FormControl,
	FormGroupDirective,
	NgForm,
	FormGroup
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(
			control &&
			control.invalid &&
			(control.dirty || control.touched || isSubmitted)
		);
	}
}
@Component({
	selector: 'app-directors',
	templateUrl: './directors.component.html',
	styleUrls: ['./directors.component.scss']
})
export class DirectorsComponent implements OnInit {
	currentPassword: string = '';
	newPassword: string = '';
	repeatPassword: string = '';
	newEmail: string = '';
	directorId: string = '';
	generatedSlot: String = '';
	hide = true;
	public emailUpdateForm: FormGroup;
	public passwordUpdateForm: FormGroup;
	matcher: MyErrorStateMatcher;

	constructor(
		private authService: AuthService,
		private snackBar: MatSnackBar,
		private fb: FormBuilder,
		private dialog: MatDialog
	) {
		this.matcher = new MyErrorStateMatcher();
		this.emailUpdateForm = this.fb.group({
			newEmail: new FormControl('', [Validators.required, Validators.email])
		});
		this.passwordUpdateForm = this.fb.group({
			currentPassword: ['', Validators.required],
			newPassword: ['', [Validators.required, Validators.minLength(4)]],
			repeatPassword: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.authService.directorId$.subscribe(directorId => {
			this.directorId = directorId;
			console.log('In director component, director Id: ', this.directorId);
		});

		this.passwordUpdateForm = this.fb.group({
			currentPassword: ['', Validators.required],
			newPassword: ['', [Validators.required, Validators.minLength(4)]],
			repeatPassword: ['', Validators.required]
		});
	}

	matchValidator(controlName: string): any {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const passwordControl = control.parent?.get(controlName);
			if (passwordControl && control.value !== passwordControl.value) {
				return { matchValidator: { value: control.value } };
			}
			return null;
		};
	}

	updatePassword(): void {
		if (this.passwordUpdateForm.valid) {
			const currentPassword = this.passwordUpdateForm.get('currentPassword')?.value;
			const newPassword = this.passwordUpdateForm.get('newPassword')?.value;
			// Call the updatePassword method of the AuthService
			this.authService.updatePassword(currentPassword, newPassword).subscribe(
				response => {
					// Handle the response if needed
					console.log('Password updated successfully:', response);
					// Show success message
					this.showSuccessMessage('Password updated successfully');
				},
				error => {
					// Handle the error if needed
					console.log('Error updating password:', error);
				}
			);
		} else {
			// Form is invalid, display error messages
			this.passwordUpdateForm.markAllAsTouched();
		}
	}

	generateSlot(): void {
		this.authService.generateNewSlot(this.directorId).subscribe(
			response => {
				// assign response slot to generatedSlot
				console.log(response);
			},
			error => {
				console.log(error);
			}
		);
	}

	confirmAction(email: any) {
		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			width: '400px',
			data: {
				email: email
			}
		});
	}

	updateEmail() {
		const newEmail = this.newEmail;

		// return;
		// Call the updateEmail method of the AuthService
		this.authService.updateEmail(this.directorId, newEmail).subscribe({
			next: response => {
				console.log('email updated', response);

				const email = response.updatedDirector.email;
				this.confirmAction(email);
			},
			error: error => {
				this.handleEmailUpdateError(error);
				// console.log('error', error?.message);
			}
		});
	}

	private handleEmailUpdateError(error: any) {
		if (error instanceof HttpErrorResponse) {
			console.error('HTTP Error Status: ', error.status);
			console.error('HTTP Error Message: ', error.error);
		} else if (error instanceof Error) {
			console.error('JS Error: ', error.message);
		} else {
			console.error('Error updating Email: ', error.toString());
		}
	}

	// updatePassword(): void {
	// 	// Call the updatePassword method of the AuthService
	// 	this.authService
	// 		.updatePassword(this.directorId, this.currentPassword, this.newPassword)
	// 		.subscribe(
	// 			response => {
	// 				// Handle the response if needed
	// 				console.log('Password updated successfully:', response);
	// 			},
	// 			error => {
	// 				// Handle the error if needed
	// 				console.log('Error updating password:', error);
	// 			}
	// 		);
	// }

	showSuccessMessage(message: string): void {
		this.snackBar.open(message, 'Close', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'bottom'
		});
	}

	alert() {
		alert('Button Clicked');
	}
}
