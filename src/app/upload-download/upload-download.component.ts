import { Component } from '@angular/core';

@Component({
	selector: 'app-hand-actions',
	templateUrl: './upload-download.component.html',
	styleUrls: ['./upload-download.component.scss']
})
export class UploadDownloadComponent {
	alert() {
		alert('Button Clicked');
	}
}
