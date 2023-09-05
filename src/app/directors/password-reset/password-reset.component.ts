import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {
	FormControl,
	FormBuilder,
	FormGroupDirective,
	NgForm,
	Validators,
	AbstractControl
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SuccessDialogService } from 'src/app/services/dialogs/success-dialog.service';

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
	selector: 'app-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
	slot: string;
	directorId: string;
	email: string;
	password: string;
	username: string;

	requestForm = this.fb.group({
		email: ['', Validators.required],
		slot: [''],
		// username: ['']
	});

	passwordResetForm = this.fb.group({
		newPass: ['', [Validators.required, Validators.minLength(4)]],
		repeatPass: ['', [Validators.required, Validators.minLength(4)]]
	});

	matcher: MyErrorStateMatcher;
	constructor(
		private authService: AuthService,
		private fb: FormBuilder,
		private successDialog: SuccessDialogService
	) {}

	ngOnInit(): void {
		this.authService.directorId$.subscribe(directorId => {
			this.directorId = directorId;
		});
	}

	// Will need this for the password reset
	matchValidator(controlName: string): any {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const passwordControl = control.parent?.get(controlName);
			if (passwordControl && control.value !== passwordControl.value) {
				return { matchValidator: { value: control.value } };
			}
			return null;
		};
	}

	requestPasswordReset(): void {
		if (this.requestForm.valid) {
			const email = this.requestForm.get('email')?.value;
			const slot = this.requestForm.get('slot')?.value;
			// const username = this.requestForm.get('username').value
			// request reset logic
			this.authService.requestPassword(email, slot).subscribe(response => {
				console.log('Password requested successfully from front end', response);
				this.showSuccessDialog();
			});
		} else {
			// Form invalid, show error
			this.requestForm.markAllAsTouched();
		}
	}

	performPassReset() {
		if (this.passwordResetForm.valid) {
			const password = this.passwordResetForm.get('password')?.value;
			const repeatPassword = this.passwordResetForm.get('repeatPassword')?.value;
			// update password logic
		} else {
			// Form invalid, show errors
			this.passwordResetForm.markAllAsTouched();
		}
	}

	showSuccessDialog() {
		this.successDialog.openPasswordRequestSuccess(
			'New Password Successfully Requested'
		);
	}
}
