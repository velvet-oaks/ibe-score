import {
	HttpClient,
	HttpHeaders,
	HttpEventType,
	HttpEvent,
	HttpRequest,
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable, of, from } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UploadDownloadService {
	private slot: string;

	constructor(private http: HttpClient) {
		this.slot = localStorage.getItem('slot') || 'ERR';
	}

	private uploadSuccessSubject = new Subject<string>();
	uploadSuccess$ = this.uploadSuccessSubject.asObservable();

	requiredFileType: string;
	fileName = '';
	uploadSub: Subscription;
	progress = 0;
	data: any;
	selectedFiles?: FileList | null = null;
	filesSelected: boolean = false;
	progressInfos: any[] = [];
	fileInfos?: Observable<any>;
	message: string[] = [];

	ngOnInit(): void {
		this.fileInfos = this.getFiles();
	}

	// multiUploader(files: File[]): Observable<HttpEvent<any>> {
	// 	const formData: FormData = new FormData();
	// 	for (let i = 0; i < files.length; i++) {
	// 		formData.append('upload', files[i]);
	// 	}

	// 	const headers = new HttpHeaders()
	// 		// .set('Origin', this.getOrigin())
	// 		.set('Content-Type', 'multipart/form-data;');

	// 	const req = new HttpRequest(
	// 		'POST',
	// 		`${environment.API_URL}/bbo?slot=${encodeURIComponent(this.slot)}`,
	// 		formData,
	// 		{
	// 			headers: headers,
	// 			reportProgress: true,
	// 			responseType: 'json'
	// 		}
	// 	);
	// 	return this.http.request(req);
	// }

	// EBU P2P code
	downloadP2PFile(p2pData: any) {
		console.log(p2pData);
		this.http
			.get<any>(environment.API_URL + '/p2p/getEBU', { params: p2pData })
			.subscribe(res => {
				console.log(res);
			});
	}

	uploadBBO(files: File[]): Observable<any> {
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		return this.http
			.post<{
				message: string;
				remoteResult: string;
				XMLResponse: string;
				XMLFile: string;
			}>(
				`${environment.API_URL}/deal_files/bbo?slot=${encodeURIComponent(
					this.slot
				)}`,
				formData,
				{
					reportProgress: true,
					observe: 'response'
				}
			)
			.pipe(
				map(response => response),
				catchError((error: any): Observable<any> => {
					console.error('upload error in uploadBBO() service', error);
					return of(null);
				})
			);
	}

	uploadUSEBIO(files: File[]): Observable<any> {
		console.log('uploadUSEBIO()service files: ', files);
		console.log('number of files is: ', files.length);

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}
		// formData.append('file', files[0])

		// await new Promise(resolve => setTimeout(resolve, 100));
		console.log('uploadUSEBIO formData is: ', formData);

		return this.http
			.post<{
				message: string;
				remoteResult: string;
				XMLResponse: string;
				XMLFile: string;
			}>(
				`${environment.API_URL}/deal_files/usebio?slot=${encodeURIComponent(
					this.slot
				)}`,
				formData,
				{
					reportProgress: true,
					observe: 'response'
				}
			)
			.pipe(
				map(response => response),
				catchError((err: any): Observable<any> => {
					console.error('Upload error in uploadUSEBIO() service: ', err);
					return of(null);
				})
			);
	}

	getOrigin(): string {
		if (environment.PRODUCTION) {
			return environment.ORIGIN;
		} else {
			return 'http://localhost:4200';
		}
	}

	// Hand record upload
	uploadFile(file: File): Observable<any> {
		const formData = new FormData();
		formData.append('upload', file);
		console.log(file);


		return this.http
			.post<{
				message: string;
				remoteResult: string;
				XMLResponse: string;
				XMLFile: string;
			}>(
				`${environment.API_URL}/deal_files/hands?SLOT=${encodeURIComponent(
					this.slot
				)}`,
				formData,
				{
					reportProgress: true,
					observe: 'response'
				}
			)
			.pipe(
				map(response => response),
				catchError((err: any): Observable<any> => {
					console.error(`upload error in uploadFile() service: `, err);
					return of(null);
				})
			);
	}

	// general Upload
	generalUpload(file: File) {
		console.log('function: generalUpload called');
		console.log(file);
		const formData = new FormData();
		formData.append('file', file);
		const headers = new HttpHeaders({
			Origin: this.getOrigin()
		});
		this.http
			.post<any>(environment.API_URL + '/p2p/uploadDeal', formData, {
				headers: headers
			})
			.subscribe(
				res => {
					console.log(res.status);
				},
				error => {
					console.log(error);
				}
			);
	}
	getFiles(): Observable<any> {
		return this.http.get(`${environment.API_URL}/bbo_get_files`);
	}
}
