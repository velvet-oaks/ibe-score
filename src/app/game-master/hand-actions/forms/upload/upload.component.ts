import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogData } from 'src/app/dialogs/login-signup-dialog/login-signup-dialog.component';
import { UploadDownloadService } from 'src/app/services/upload-download.service';
import { environment } from 'src/environments/environment';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { UploadDialogService } from 'src/app/services/dialogs/upload-dialog.service';
import { FailureDialogService } from 'src/app/services/dialogs/fail-dialog.service';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
	requiredFileType: string;
	fileName = '';
	uploadAcceptedTypes = '';
	uploaded: any;
	filesSelected: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<UploadComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialog: MatDialog,
		public uploadDownload: UploadDownloadService,
		private http: HttpClient,
		private uploadDialogService: UploadDialogService,
		private failureDialogService: FailureDialogService
	) {
		this.uploadAcceptedTypes = data?.uploadAcceptedTypes || '.dlm, .dup, .pbn';
	}

	@ViewChild('fileUpload') fileUpload: ElementRef;
	@ViewChild('bboUpload') bboUpload: ElementRef;

	onFileSelected(event: any) {
		const file: File = event?.target?.files[0];
		if (file) {
			this.fileName = file.name;
			console.log('function onFileSelected() called');
			console.log(file);

			this.uploadDownload.uploadFile(file).subscribe(
				() => {
					console.log(this.fileName);
					this.openSuccessDialog();
				},
				error => {
					console.log(error);
				}
			);
		}
	}

	openSuccessDialog(
		isBBOUpload: boolean = false,
		isFileSelected: boolean = false
	): void {
		console.log('open success dialog called successfully');
		const dialogRef = this.dialog.open(SuccessDialogComponent, {
			width: '250px',
			data: { message: 'File uploaded successfully.' } // Pass the message data to the dialog
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('result:', result);
			if (result && result.continue === true) {
				console.log('result.continue:', result.continue);
				console.log(
					'close parent:',
					result.closeParent,
					'continue:',
					result.continue
				);
				this.fileName = ''; // Reset the selected file name
				this.fileUpload.nativeElement.value = '';
				this.bboUpload.nativeElement.value = '';
				if (result.closeParent) {
					dialogRef.close();
				}
			} else {
				console.log('result.continue = false:', result.continue);
				this.onClose();
			}
		});
		if (isBBOUpload) {
			console.log('BBO Uploaded');
		}
		if (isFileSelected) {
			console.log('File Selected', this.fileName);
		} else {
			console.log('no action taken');
		}
	}

	openFailureDialog(message: String): void {
		const dialogRef = this.dialog.open(SuccessDialogComponent, {
			width: '250px',
			data: { message: message } // Pass the message data to the dialog
		});
	}

	onClose(): void {
		this.dialogRef.close({ continue: false, closeParent: true });
	}

	openFileUploadDialog(): void {
		const isBBOUpload = true;

		if (isBBOUpload) {
			const uploadAcceptedTypes = '.html';
			this.uploadDialogService.openBBOUploadDialog(uploadAcceptedTypes);
		} else {
			const uploadAcceptedTypes = '.dln, .dup, .pbn';

			this.dialog.open(UploadComponent, {
				width: '500px',
				disableClose: true,
				data: {
					uploadAcceptedTypes: uploadAcceptedTypes
				}
			});
		}
	}
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		// Add any necessary visual cues or styles to indicate the file can be dropped
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		// Remove any visual cues or styles from the file input element
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		// Remove any visual cues or styles from the file input element

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			this.fileName = file.name;
			if (file.name.toLowerCase().endsWith('.html')) {
				this.uploadDownload.uploadFile(file).subscribe(
					() => {
						console.log(this.fileName);
						this.openSuccessDialog();
					},
					error => {
						console.log(error);
					}
				);
			} else {
				this.openFailureDialog('Sorry, only .html files allowed');
			}
		}
	}

	triggerClick(element: HTMLInputElement): void {
		element.click();
	}
}
