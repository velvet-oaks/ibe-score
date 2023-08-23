import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadComponent } from '../../game-master/hand-actions/forms/upload/upload.component';
@Injectable({
	providedIn: 'root'
})
export class UploadDialogService {
	private dialogRef: MatDialogRef<UploadComponent>;

	constructor(private dialog: MatDialog) {}

	openDialog(): void {
		this.dialogRef = this.dialog.open(UploadComponent, {
			width: '500px',
			disableClose: true
		});
	}

	openBBOUploadDialog(uploadAcceptedTypes: String):  void {
		this.dialog.open(UploadComponent, {
			width: '500px',
			disableClose: true,
			data: {
				uploadAcceptedTypes: uploadAcceptedTypes
				// Pass any specific data required for the BBO upload
			}
			// Additional configuration for the BBO upload dialog
		});
	}
	closeDialog(): void {
		this.dialogRef?.close();
	}
}
