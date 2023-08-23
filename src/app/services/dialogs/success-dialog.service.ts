import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../game-master/hand-actions/forms/success-dialog/success-dialog.component';
import { DialogComponent } from 'src/app/general-components/dialog/dialog.component';
@Injectable({
	providedIn: 'root'
})
export class SuccessDialogService {
  constructor(private dialog: MatDialog) { }

	openSuccessDialog(message: string): void {
		this.dialog.open(SuccessDialogComponent, {
			width: '400px',
			data: {
				message: message
			}
		});
	}

	openPasswordRequestSuccess (message: string): void {
		this.dialog.open(DialogComponent, {
			width: '400px',
			data: {
				message: message
			}
		})
	}
}
