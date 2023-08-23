import { Component } from '@angular/core';
import { UploadComponent } from './forms/upload/upload.component';
import { MatDialog } from '@angular/material/dialog';
import { EBUP2PComponent } from './forms/ebu-p2-p/ebu-p2-p.component';
import { UploadDownloadService } from 'src/app/services/upload-download.service';

@Component({
	selector: 'app-hand-actions',
	templateUrl: './hand-actions.component.html',
	styleUrls: ['./hand-actions.component.scss']
})
export class HandActionsComponent {
	constructor(
		public dialog: MatDialog,
		public uploadDownloadService: UploadDownloadService
	) {}

	uploadGame() {
		const uploadDialog = this.dialog.open(UploadComponent, {
			width: '80vw',
			data: {
				uploadAcceptedTypes: '.dlm, .dup, .pbn'
			}
		});
		// uploadDialog.afterClosed().subscribe(result => {
		// 	this.uploadDownloadService.generalUpload(result);
		// });
		// // })
	}

	openEBU() {
		const uploadDialog = this.dialog.open(EBUP2PComponent, {});
		// uploadDialog.afterClosed().subscribe(result => {
		uploadDialog.afterClosed().subscribe(result => {
			console.log(result); //result is the file
		});
	}

	openBBO() {
		const uploadDialog = this.dialog.open(UploadComponent, {
			width: '80vw',
			data: {
				uploadAcceptedTypes: '.bbo'
			}
		});
	}

	deleteHand() {

	}


	alert() {
		alert('Button Clicked');
	}
}
