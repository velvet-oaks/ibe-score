import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../game-master/hand-actions/forms/success-dialog/success-dialog.component';

@Injectable({
	providedIn: 'root'
})
export class FailureDialogService {
	constructor(private dialog: MatDialog) {}

	openFailureDialog(message: string): void {
		this.dialog.open(SuccessDialogComponent, {
			width: '400px',
			data: {
				message: message
			}
		});
	}
}
