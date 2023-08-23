import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	ValidationErrors,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../services/auth/auth.service';

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
export function checkMatchValidator(field1: string, field2: string) {
	return function (frm: any) {
		let field1Value = frm.get(field1).value;
		let field2Value = frm.get(field2).value;

		if (field1Value !== '' && field1Value !== field2Value) {
			return { notMatch: `value ${field1Value} is not equal to ${field2}` };
		}
		return null;
	};
}

@Component({
	selector: 'app-create-player',
	templateUrl: './create-player.component.html',
	styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent {
	types = ['bexbronze', 'bexsilver', 'bexgold'];
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
	myForm = this.fb.group({
		name: ['', [Validators.required]],
		type: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		tel_phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
		password: ['', [Validators.required, Validators.minLength(8)]],
		password_confirm: ['', [Validators.required, this.matchValidator('password')]],
		country: ['', [Validators.required]],
		slot: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
	});

	constructor(private fb: FormBuilder, private authService: AuthService) {}

	ngOnInit(): void {
		let root = this;
		setInterval(function () {
			//  console.log(root.myForm)
		}, 2000);
	}
	matcher = new MyErrorStateMatcher();

	submitForm() {
		console.log(this.myForm);
		if (this.myForm.valid) {
			console.log('valid');
			this.authService.createUser(this.myForm);
			this.myForm.reset();
		}
	}
}
