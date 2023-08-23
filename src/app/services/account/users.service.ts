import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class UsersService {
	public users: any[];
	usersUpdated = new Subject<{ users: any[] }>();
	constructor(private http: HttpClient) {}

	updateUserList() {
		let root = this;
		this.http
			.get<{ users: any }>(environment.API_URL + '/auth')
			.subscribe(userData => {
				this.users = userData.users;
				root.users = userData.users;
				this.usersUpdated.next({ users: this.users });
			});
	}

	checkUserName(name) {}
	getUserList() {
		return this.usersUpdated.asObservable();
	}
	getUser() {
		return this.users;
	}
}
