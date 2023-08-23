import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(


    public dialogRef: MatDialogRef<DialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }

  onClose(): void {
    this.dialogRef.close()
  }


	closeAllDialogs(): void {
		this.dialog.closeAll();
	}
}
