import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/dialogs/login-signup-dialog/login-signup-dialog.component';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroupDirective,
	NgForm,
	ValidatorFn,
	Validators
} from '@angular/forms';
import { UsersService } from 'src/app/services/account/users.service';
import { UploadDownloadService } from 'src/app/services/upload-download.service';

@Component({
	selector: 'app-ebu-p2-p',
	templateUrl: './ebu-p2-p.component.html',
	styleUrls: ['./ebu-p2-p.component.scss']
})
export class EBUP2PComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<EBUP2PComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private fb: FormBuilder,
		private uploadDownloadService: UploadDownloadService
	) {}

	ngOnInit(): void {}

	clubDetailsForm = this.fb.group({
		event_name: ['', Validators.required],
		td_name: ['', Validators.required],
		td_email: ['', Validators.required],

		club_name: ['', Validators.required],
		club_id: ['', Validators.required],
		password: ['', Validators.required],
		comment: [''],

		charge_code: [Number, Validators.required],
		use_master: [false, Validators.required],
		master_color: [''],
		master_scale: [''],
		use_master_perMatch: [false, Validators.required]
	});

	submitClubDetails() {
		let formOutput = this.clubDetailsForm.value;
		console.log(formOutput);

		if (this.clubDetailsForm.valid) {
			this.uploadDownloadService.downloadP2PFile(formOutput);
		} else {
			this.clubDetailsForm.markAllAsTouched();
		}
	}
}
