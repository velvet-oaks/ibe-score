import { Component, Inject, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroupDirective,
	NgForm,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { UsersService } from 'src/app/services/account/users.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DialogComponent } from 'src/app/general-components/dialog/dialog.component';

export interface DialogData {
	type: string;
	username: string;
	password: string;
	loginType: string;
}
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
	selector: 'app-login-signup-dialog',
	templateUrl: './login-signup-dialog.component.html',
	styleUrls: ['./login-signup-dialog.component.scss']
})

// LoginSignupDialogComponent
export class LoginSignupDialogComponent implements OnInit {
	types = ['bexbronze', 'bexsilver', 'bexgold'];
	unqiueUserError: any = false;
	hidePassword: boolean = true;
	hide = true;
	loginType: string;
	private isDialogOpen: boolean = false;

	private matchValidator(controlValidationName: string): ValidatorFn {
		return (control: AbstractControl) => {
			const controlValidation = control.root.get(controlValidationName);
			if (!controlValidation) {
				return null;
			}
			return controlValidation.value !== control.value
				? { matchValidator: { value: control.value } }
				: null;
		};
	}

	constructor(
		public dialogRef: MatDialogRef<LoginSignupDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private fb: FormBuilder,
		private authService: AuthService,
		private userService: UsersService,
		private http: HttpClient,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.authService.loginStatusSubject.subscribe(status => {
			console.log('status is: ', status);
			if (status === 'ERRORNOUSER') {
				console.log('No user found');
				this.openDialog('Director or Player does not exist');
			} else if (status === 'ERRORPASS') {
				console.log('password Incorrect');
				this.openDialog('Password Incorrect');
			}
		});
	}

	openDialog(message: string) {
		// if (this.dialogRef && this.dialogRef.componentInstance) {
		if (this.isDialogOpen) {
			return;
		}
		this.isDialogOpen = true;

		const dialogRef = this.dialog.open(DialogComponent, {
			width: '300px',
			data: { message }
		});

		dialogRef.afterClosed().subscribe(() => {
			this.dialogRef = null;
			this.isDialogOpen = false;
			console.log('dialog closed');
		});
	}

	toggleVisibility() {
		this.hidePassword = !this.hidePassword;
	}
	selectedTab: string = 'slot';

	slotForm = this.fb.group({
		slot: ['', [Validators.required]],
		password: ['', [Validators.required]]
	});
	usernameForm = this.fb.group({
		user_name: ['', [Validators.required]],
		password: ['', [Validators.required]]
	});

	signUpForm = this.fb.group({
		name: ['', [Validators.required]],
		username: ['', [Validators.required]],
		// type: ['', [Validators.required]],
		type: [''],
		email: ['', [Validators.required, Validators.email]],
		tel_phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
		password: ['', [Validators.required, Validators.minLength(4)]],
		password_confirm: ['', [Validators.required, this.matchValidator('password')]],
		country: ['', [Validators.required]],
		slot: ['', [Validators.pattern('^[a-zA-Z0-9]*$')]]
	});
	matcher = new MyErrorStateMatcher();
	onNoClick(): void {
		this.dialogRef.close();
	}
	submitForm() {
		console.log('checking submit form...');
		if (this.data.type === 'login') {
			if (this.selectedTab === 'slot' && this.slotForm.valid) {
				const slotName = this.slotForm.get('slot').value;
				const password = this.slotForm.get('password').value;

				this.data.loginType = 'slot';
				this.data.username = slotName;
				this.data.password = password;

				this.authService.login(this.data);
				this.dialogRef.close();
			} else if (this.selectedTab === 'username' && this.usernameForm.valid) {
				const username = this.usernameForm.get('user_name').value;
				const password = this.usernameForm.get('password').value;

				this.data.loginType = 'user_name';
				this.data.username = username;
				this.data.password = password;

				this.authService.login(this.data);
				this.dialogRef.close();
			} else {
				if (this.selectedTab === 'slot') {
					this.slotForm.markAllAsTouched();
				} else if (this.selectedTab === 'username') {
					this.usernameForm.markAllAsTouched();
				}
			}
		} else {
			if (this.signUpForm.valid) {
				this.authService.createUser(this.signUpForm);
				this.dialogRef.close();
			} else {
				this.signUpForm.markAllAsTouched();
			}
		}
	}

	// submitForm() {}
}
