import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UploadDialogService } from '../../../../services/dialogs/upload-dialog.service';

@Component({
	selector: 'app-success-dialog',
	templateUrl: './success-dialog.component.html',
	styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {
	message: string;

	constructor(
		public dialogRef: MatDialogRef<SuccessDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
    private uploadDialogService: UploadDialogService,
    private dialog: MatDialog

	) {
		this.message = data.message;
	}

	onContinue(): void {
		this.dialogRef.close({ continue: true, closeParent: false });
	}

	onClose(): void {
		this.dialogRef.close({ continue: false, closeParent: true });
	}
}
