import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadDownloadService } from 'src/app/services/upload-download.service';
import { Observer, Observable, Subscription, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-bbo-tab',
	templateUrl: './bbo-tab.component.html',
	styleUrls: ['./bbo-tab.component.scss']
})
export class BboTabComponent {
	selectedFiles?: FileList | null = null;
	filesSelected: boolean = false;
	progressInfos: any[] = [];
	uploaded: boolean = false;
	fileInfos?: Observable<any>;
	filesArray: File[] = [];
	message: string[] = [];
	progress = 0;
	uploading = false;
	uploadSuccessMessage: string | null = null;
	showAlert = false;
	alertType = '';
	alertMessage = '';

	private uploadSuccessSubscription: Subscription;
	constructor(
		private uploadDownload: UploadDownloadService,
		private http: HttpClient
	) {}

	ngOnInit(): void {
		this.uploadSuccessSubscription = this.uploadDownload.uploadSuccess$.subscribe(
			message => {
				this.uploadSuccessMessage = message;
			}
		);
		this.fileInfos = this.getFiles();
	}

	ngOnDestroy(): void {
		this.uploadSuccessSubscription.unsubscribe();
	}

	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

	showAlertBox(type: string, message: string): void {
		this.showAlert = true;
		this.alertType = type;
		this.alertMessage = message;
		console.log(
			'showAlertBox(): ',
			this.alertType,
			this.showAlert,
			this.alertMessage
		);

		// setTimeout(() => {
		// 	this.hideAlertBox();
		// }, 5000);
	}

	hideAlertBox(): void {
		this.showAlert = false;
		this.alertType = '';
		this.alertMessage = '';
	}

	clickHideAlert(): void {
		this.filesArray = [];
		this.filesSelected = false;
		this.showAlert = false;
		this.alertType = '';
		this.alertMessage = '';
	}

	triggerClick(element: HTMLInputElement): void {
		element.click();
	}

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.addDragStyles();
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.removeDragStyles();
	}

	onFileChangeOrDrop(event: Event | DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.removeDragStyles();
		this.addFilesSelectedStyles();
		// this.hideAlertBox();
		const files =
			event instanceof DragEvent
				? event.dataTransfer?.files
				: (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			// this.filesArray.push()
			this.handleFiles(files);
		}
	}

	addDragStyles(): void {
		const dragBox = document.querySelector('.drag-box');
		dragBox?.classList.add('drag-over');
	}
	removeDragStyles(): void {
		const dragBox = document.querySelector('.drag-box');
		dragBox?.classList.remove('drag-over');
	}
	addFilesSelectedStyles(): void {
		const dragBox = document.querySelector('.drag-box');
		dragBox?.classList.add('selected');
	}

	onFileChange(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.selectedFiles = inputElement.files;
		this.filesSelected = true;
	}
	handleFiles(files: FileList): void {
		this.selectedFiles = files;
		this.filesSelected = true;
		console.log('handleFiles(): ', files[0].name);
		this.updateFilesArray();
	}

	getFilesArray(): File[] {
		console.log('getFilesArray(): ', Array.from(this.selectedFiles)[0].name);
		return Array.from(this.selectedFiles);
	}
	updateFilesArray(): void {
		if (this.selectedFiles) {
			this.filesArray = Array.from(this.selectedFiles) as File[];
		} else {
			this.filesArray = [];
		}
	}

	uploadFiles(): void {
		this.message = [];
		if (this.selectedFiles) {
			this.uploading = true;
			this.filesSelected = false;
			const filesArray: File[] = Array.from(this.selectedFiles);
			this.filesArray = filesArray;
			let processFailed = false;
			let xmlFile;
			this.uploadDownload.uploadBBO(this.filesArray).subscribe({

				next: (event: any) => {
					console.log(
						'uploadFiles() event: ',
						event + '\n',
						'typeof event: ',
						typeof event + '\n',
						'properties of the event object are: ',
						Object.keys(event)
					);
					xmlFile = event.body?.responseData?.XMLFile;
					console.log('values of the event are: ', Object.values(event));


					// Handle the success upload, and get response from V server
					if (event.type === HttpEventType.UploadProgress) {
						this.progress = Math.round((100 * event.loaded) / event.progress);
					} else if (event instanceof HttpResponse) {
						console.log('All Files Uploaded Successfully');
						this.uploaded = true;
						console.log('uploadFiles() event.body', event.body);

						const victorsResponse = event.body?.responseData.remoteResult;


						console.log('uploadFiles(), ', victorsResponse);
						if (victorsResponse === 'SUCCESS') {
							// Handle processing success
							this.showAlertBox('success', 'Upload Successful');
						} else if (victorsResponse === 'FAIL') {
							console.log("uploadFiles() victor'sResponse: ", victorsResponse);
							// Handle processing fail
							this.showAlertBox(
								'info',
								'Could not process the BBO digest. Please contact...'
							);
							this.uploaded = false;
							processFailed = true;
						} else {
							// Handle error
							this.showAlertBox(
								'error',
								'An error occurred during upload. Please try again. If the problem persists, please contact...'
							);
							processFailed = true;
						}
					}
				},
				error: (error: any) => {
					console.error('error in uploadFiles()', error);
					this.uploaded = false;
					this.filesArray = [];
					console.log('Error in uploadFiles(), XML: ', xmlFile)

					// Handle the error
				},
				complete: () => {
					this.uploading = false;
					if (processFailed) {
						this.uploaded = false;
						this.filesArray = [];
					} else {
						this.uploaded = true;
						this.filesArray = [];
					}
					console.log('uploadFiles() complete:() logged');
					// console.log('XML: ', xmlFile)

					// this.filesArray = [];
				}
			} as Observer<any>);
		}
	}


	getFiles(): Observable<any> {
		return this.http.get(`${environment.API_URL}/bbo_get_files`);
	}

}
