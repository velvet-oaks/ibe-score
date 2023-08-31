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
import { AuthService } from '../services/auth/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { UsersService } from 'src/app/services/account/users.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogComponent } from 'src/app/general-components/dialog/dialog.component';
import { RevisedCountryModel } from 'src/app/shared/revisedCountryModel';
import { revisedCountryData } from 'src/app/shared/revisedCountryData';
import { countries } from 'src/app/shared/country-data-store';
import { Country } from 'src/app/shared/countryModel';
import { AccountType } from 'src/app/shared/typeModel';
import { accountTypes } from 'src/app/shared/types-data-store';
// import { cities } from 'src/app/shared/cities-data-store';
import { CityModel } from 'src/app/shared/cityModel';
import { UsageModel } from 'src/app/shared/usageModel';
import { usageList } from 'src/app/shared/usage-list';

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
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})

// LoginSignupDialogComponent
export class RegistrationComponent implements OnInit {
	// public cities: CityModel[] = cities;

	public cityNames: string[] = [];
	public citySearchText: string = '';
	public filteredCities: string[] = [];
	public usageList: UsageModel[] = usageList;

	// types = ['bexbronze', 'bexsilver', 'bexgold', ''];
	unqiueUserError: any = false;
	hidePassword: boolean = true;
	hide = true;
	loginType: string;
	private isDialogOpen: boolean = false;
	dialingCodeValue?: any;

	selectedCountry?: RevisedCountryModel;
	disabledDialingCode = true;

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

	public accountTypes: AccountType[] = accountTypes;
	public revisedCountries: RevisedCountryModel[] = revisedCountryData;
	// public cityNames: [] = [];
	// public citySearchText: string = '';
	// public filteredCities: string[] = [];

	constructor(
		public dialogRef: MatDialogRef<RegistrationComponent>,
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

		this.signUpForm
			.get('country')
			.valueChanges.subscribe((selectedCountry: string) => {
				const dialingCode = this.findValueInData<string>(
					selectedCountry,
					this.revisedCountries,
					'name'
				);
				this.signUpForm.get('dialingCode').setValue(dialingCode);
			});

		this.signUpForm
			.get('country')
			.valueChanges.subscribe((selectedCountry: string) => {
				const matchedCountry = this.revisedCountries.find(
					country => country.name === selectedCountry
				);
				if (matchedCountry) {
					this.signUpForm.get('dialingCode').setValue(matchedCountry.dial_code);
				}
			});
	}

	findValueInData<T>(selectedValue: any, dataStore: any[], searchField: string): T {
		const matchedItem = dataStore.find(item => item.name === selectedValue);
		return matchedItem ? matchedItem[searchField] : null;
	}

	filterCities() {
		if (!this.citySearchText && this.citySearchText.length >= 2) {
			this.filteredCities = this.cityNames;

			this.filteredCities = this.cityNames.filter(cityName =>
				cityName.toLowerCase().includes(this.citySearchText.toLowerCase())
			);
		} else {
			this.filteredCities = [];
		}
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
		first_name: ['', [Validators.required]],
		last_name: ['', [Validators.required]],
		username: ['', [Validators.required]],
		type: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		tel_phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
		password: ['', [Validators.required, Validators.minLength(4)]],
		password_confirm: ['', [Validators.required, this.matchValidator('password')]],
		country: ['', [Validators.required]],
		slot: ['', [Validators.pattern('^[a-zA-Z0-9]*$')]],
		dialingCode: [''],
		city: ['', [Validators.required]],
		usage: ['', [Validators.required]],
		comments: [''],
		howHeard: ['', [Validators.required]],
		feedback: ['', [Validators.required]]
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
}
