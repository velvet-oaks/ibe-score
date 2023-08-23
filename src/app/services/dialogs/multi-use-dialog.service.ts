import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../general-components/dialog/dialog.component';

@Injectable({
	providedIn: 'root'
})
export class MultiUseDialogService {
	constructor(private dialog: MatDialog) {}

	openDialogue(data: any): MatDialogRef<DialogComponent> {
		return this.dialog.open(DialogComponent, {
			data: data,
			disableClose: true,
			width: '60vw'
		});
	}
}
