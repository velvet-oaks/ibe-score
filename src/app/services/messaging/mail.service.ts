import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MailService {
	constructor(private http: HttpClient) {}

	sendMail(
		recipientFullName: string,
		recipientUsername: string,
		recipientEmail: string,
		recipientSlot: string,
		mailType: 'existing' | 'new',
		userType: 'bexbronze' | 'bexsilver' | 'bexgold'
	): Observable<any> {
		return this.http.post<any>(environment.API_URL + '/mail', {
			recipientFullName,
			recipientUsername,
			recipientEmail,
			recipientSlot,
			mailType: mailType,
			userType: userType
		});
	}
}
