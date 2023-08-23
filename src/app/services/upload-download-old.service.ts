import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UploadDownloadService {

	constructor(private http: HttpClient) { }

	requiredFileType: string;
	fileName = '';
	uploadSub: Subscription;


	// EBU P2P code
	downloadP2PFile(p2pData: any) {
		console.log(p2pData);
		this.http
			.get<any>(environment.API_URL + '/p2p/getEBU', { params: p2pData })
			.subscribe(res => {
				console.log(res);
			});
	}

	uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(environment.API_URL + '/p2p/uploadDeal', formData);
  }

	// general Upload
	generalUpload(file: File) {
		console.log(file);
		const formData = new FormData();
		formData.append('file', file);
		// function generateBoundary(): string {
		// 	let boundary = '';
		// 	const possibleCharacters =
		// 		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		// 	for (let i = 0; i < 16; i++) {
		// 		boundary += possibleCharacters.charAt(
		// 			Math.floor(Math.random() * possibleCharacters.length)
		// 		);
		// 	}

		// 	return boundary;
		// }

	// 	function generateFormDataPayload(formData: FormData, boundary: string): string {
	// 		let payload = '';

	// 		formData.forEach((value, key) => {
	// 			payload += `--${boundary}\r\n`;
	// 			payload += `Content-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
	// 		});

	// 		payload += `--${boundary}--`;

	// 		return payload;
	// 	}

	//   const boundary = generateBoundary();
	//   const payload  = generateFormDataPayload(formData, boundary)
	// 	// const headers = new HttpHeaders({
	// 	// 	'Content-Type': `multipart/form-data; boundary=${boundary}`
	//   // });
	//   console.log(payload)
		this.http
			.post<any>(environment.API_URL + '/p2p/uploadDeal', formData)
			.subscribe(
				res => {
					console.log(res.status);
				},
				error => {
					console.log(error);
				}
			);
	}


	// generalUpload(event) {
	// 	const file: File = event.target.files[0];
	// 	if (file) {
	// 		const fileName = file.name; // Declare and assign the fileName here

	// 		const formData = new FormData();
	// 		formData.append('thumbnail', file);

	// 		const upload$ = this.http.post(
	// 			environment.API_URL + '/p2p/uploadDeal',
	// 			formData
	// 		);

	// 		upload$.subscribe(
	// 			() => {
	// 				// Upload successful
	// 				console.log(fileName);
	// 			},
	// 			error => {
	// 				// Handle the error
	// 			}
	// 		);
	// 	}
	// }
}
