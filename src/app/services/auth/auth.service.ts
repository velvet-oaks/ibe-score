import { Injectable, ɵɵNgModuleDeclaration } from '@angular/core';
import * as userDummy from '../../data/users.json';
import * as bcrypt from 'bcryptjs';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UsersService } from '../account/users.service';
import { MailService } from '../messaging/mail.service';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private tokenTimer: any;

	loginStatusSubject: Subject<string> = new Subject<string>();
	userStatusSubject: Subject<string> = new Subject<string>();

	passwordCorrect: boolean = false;
	userExist: boolean = false;
	private timeLeft: moment.Duration;
	private slotSubject = new BehaviorSubject<string>(null);
	private idSubject = new BehaviorSubject<string>(null);
	private usernameSubject = new BehaviorSubject<string>(null);
	private expiresAtSubject = new BehaviorSubject<moment.Moment>(null);
	private currentSlot: string = this.slotSubject.getValue();
	private currentUsername: string;
	private currentExpiration: moment.Moment;
	private authExpiration: moment.Moment;

	isAuthed = false;
	isAuthenticated = false;
	isAuthedUpdate = new Subject<boolean>();

	directorId$ = this.idSubject.asObservable();
	slot$ = this.slotSubject.asObservable();
	username$ = this.usernameSubject.asObservable();
	expiresAt$ = this.expiresAtSubject.asObservable();

	constructor(
		private http: HttpClient,
		private router: Router,
		private userService: UsersService,
		private mailService: MailService
	) {
		this.expiresAtSubject.next(this.authExpiration);

		this.slot$.subscribe(slot => {
			this.currentSlot = slot;
		});
		this.username$.subscribe(username => {
			this.currentUsername = username;
		});
		// this.expiresAt$.subscribe(() => {
		// 	this.calculateTimeLeft();
		// });

		const storedExpiresAt = JSON.parse(localStorage.getItem('expires_at'));
		this.authExpiration = moment(storedExpiresAt);
		// this.calculateTimeLeft();

		const storedSlot = this.slotSubject.getValue();
		this.slotSubject.next(storedSlot || null);
		const storedId = this.idSubject.getValue();
		this.idSubject.next(storedId || null);
	}

	private calculateTimeLeft() {
		const now = moment();
		this.timeLeft = moment.duration(this.authExpiration.diff(now));
	}

	checkAuthStatus() {
		this.isAuthedUpdate.next(this.isAuthed);
	}
	getisAuthed() {
		return this.isAuthedUpdate.asObservable();
	}
	updateSlotValue(slot: string): void {
		this.slotSubject.next(slot);
		console.log('authService.updateSlotValue() slot :', slot);
	}

	updateUsername(username: string): void {
		this.usernameSubject.next(username);
		console.log('current username is: ', username);
	}

	updatedirectorId(uId: string): void {
		this.idSubject.next(uId);
		console.log('authService.updatedDirectorId() is :', uId);
	}

	private setSession(authResult) {
		console.log('settingsession');
		console.log('authResult is: ', authResult);
		const expiresAt = moment().add(1, 'hour');
		this.authExpiration = moment().add(authResult.expires, 'milliseconds');
		console.log(expiresAt);
		localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
		localStorage.setItem(
			'auth_expires',
			JSON.stringify(this.authExpiration.valueOf)
		);
		if (!environment.PRODUCTION) {
			console.log('Saving Local');
			localStorage.setItem('id_token', authResult.idToken);
		}

		localStorage.setItem('authResult', JSON.stringify(authResult));

		const defaultValue: string = 'No Slot Found';
		if (!authResult.directorUsername) {
			this.currentUsername = authResult.directorSlot || defaultValue;
		} else {
			this.currentUsername = authResult.directorUsername;
		}

		localStorage.setItem('username', this.currentUsername);
		this.updateUsername(this.currentUsername);
		localStorage.setItem('slot', authResult.directorSlot);
		if (!authResult.directorSlot) {
			this.currentSlot = defaultValue;
		} else {
			this.currentSlot = authResult.directorSlot;
			this.slotSubject.next(this.currentSlot);
		}

		this.updateSlotValue(this.currentSlot);
		let directorId = authResult.directorId;
		localStorage.setItem('id', directorId);
		if (directorId) {
			this.updatedirectorId(directorId);
		}
		this.checkAuth();
		this.isAuthed = true;
		console.log('authService.setSession() this.currentSlot: ', this.currentSlot);
		console.log('authService.setSession() this.isAuthed: ', this.isAuthed);

		this.isAuthedUpdate.next(true);
		this.router.navigate(['/main']);
	}

	logout() {
		this.http.get<{}>(environment.API_URL + '/auth/logout').subscribe();
		localStorage.removeItem('id_token');
		localStorage.removeItem('expires_at');
		localStorage.removeItem('slot');
		this.updateSlotValue(null); // Clear the slot value

		clearInterval(this.tokenTimer);
		this.isAuthed = false;
		this.isAuthedUpdate.next(false);
		this.router.navigate(['/']);
	}
	public isLoggedIn() {
		return moment().isBefore(this.getExpiration());
	}
	isLoggedOut() {
		return !this.isLoggedIn();
	}

	getExpiration() {
		const expiration = localStorage.getItem('expires_at');
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}
	autoAuth() {
		if (this.isLoggedIn()) {
			this.isAuthed = true;

			console.log('authService.autoAuth() this.isAuthed: ', this.isAuthed);
			const authResult = JSON.parse(localStorage.getItem('authResult'));

			// Update the expiresAtSubject with the new expiration time
			this.expiresAtSubject.next(authResult.expires);

			this.slotSubject.next(authResult.directorSlot);
			this.idSubject.next(authResult.directorId);
			console.log(this.slotSubject.getValue() + '\n' + this.idSubject.getValue());

			console.log('authService.autoAuth() authResult: ', authResult);

			this.isAuthedUpdate.next(true);
			this.checkAuth();
			this.router.navigate(['/main']);
		} else {
			this.router.navigate(['/']);
		}
	}

	// autoAuth() {
	// 	//console.log(this.isLoggedIn())
	// 	if (this.isLoggedIn()) {
	// 		this.isAuthed = true;

	// 		console.log('authService.autoAuth() this.isAuthed: ', this.isAuthed);
	// 		const authResult = JSON.parse(localStorage.getItem('authResult'));
	// 		this.slotSubject = authResult.directorSlot;
	// 		this.idSubject = authResult.directorId;
	// 		console.log(this.slotSubject + '\n' + this.idSubject);
	// 		// debugging
	// 		// console.log('Current time (without milliseconds):', moment().startOf('second'));
	// 		console.log('authService.autoAuth() authResult: ', authResult);
	// 		// console.log('authResult.expires: ', authResult.expires)

	// 		this.isAuthedUpdate.next(true);
	// 		this.checkAuth();
	// 		this.router.navigate(['/main']);
	// 	} else {
	// 		this.router.navigate(['/']);
	// 	}
	// }

	private checkAuth() {
		let root = this;
		this.tokenTimer = setInterval(() => {
			console.log('Checking Auth');
			if (!moment().isBefore(root.getExpiration())) {
				this.isAuthed = false;
				this.isAuthedUpdate.next(false);
				this.logout();
			}
		}, 60000);
	}

	// new async login()

	async login(data) {
		console.log('data is: ', data);
		let sendData = {};
		if (data.loginType === 'slot') {
			sendData = {
				username: data.username,
				password: data.password,
				type: data.loginType
			};
		} else if (data.loginType === 'user_name') {
			sendData = {
				username: data.username,
				password: data.password,
				type: data.loginType
			};
		}

		try {
			const responseData = await this.http
				.post<any>(environment.API_URL + '/auth/login', sendData)
				.toPromise();
			console.log(environment.API_URL + '/auth/login');
			console.log('from auth service, status is: ', responseData.status);

			if (responseData.status === 'ERRORNOUSER') {
				console.log(responseData);
				this.loginStatusSubject.next('ERRORNOUSER');
				alert('Director or Player does not exist');
			} else if (responseData.status === 'ERRORPASS') {
				this.loginStatusSubject.next('ERRORPASS');
				this.passwordCorrect = false;
				alert('Password Incorrect');
			} else {
				this.setSession(responseData);
				this.loginStatusSubject.next('');
				this.userExist = true;
				this.passwordCorrect = true;
				console.log('responseData', responseData);
			}
		} catch (error) {
			console.error('Error occurred during login:', error);
			if (error?.error?.status === 'ERRORNOUSER') {
				this.loginStatusSubject.next('ERRORNOUSER');
			} else if (error?.error?.status === 'ERRORPASS') {
				this.loginStatusSubject.next('ERRORPASS');
				this.passwordCorrect = false;
			} else {
				this.loginStatusSubject.next('ERROR');
			}
		}

		console.log('userExist: ', this.userExist);
		console.log('passwordCorrect: ', this.passwordCorrect);
	}

	//createUser(test: any){}
	async createUser(formData: any) {
		console.log(formData);
		let newUser = {
			full_name: formData.value.name,
			user_name: formData.value.username,
			email: formData.value.email,
			password: formData.value.password,
			type: formData.value.type,
			country: formData.value.country,
			slot: formData.value.slot,
			userData: {
				addDate: new Date().getTime()
			}
		};
		await this.http
			.post<{ message: String; err: any; user: any }>(
				environment.API_URL + '/auth',
				newUser
			)
			.subscribe(responseData => {
				if (responseData.err) {
					alert('Error Detected Check Console for details');
					console.log('ERROR: ' + responseData.err);
					console.log(responseData);
				} else {
					this.setSession(responseData);
					this.slotSubject.next(newUser.slot);
					this.userService.updateUserList();
				}
			});
	}

	deleteUser(id: any) {
		this.http
			.delete<{ deletedUser: any; message: String; err: any }>(
				environment.API_URL + '/auth?id=' + id
			)
			.subscribe(responseData => {
				if (responseData.err) {
					alert('Error Detected Check Console for details');
					console.log('ERROR: ' + responseData.err);
				} else {
					this.userService.updateUserList();
				}
			});
	}

	// setdirectorId(directorId: string): void {
	// 	this.directorId = directorId;
	// }

	updateEmail(directorId: string, newEmail: string): Observable<any> {
		const url = environment.API_URL + '/auth/update-email';
		const body = { email: newEmail };

		return this.http.put<any>(url, body);
	}

	updatePassword(currentPassword: string, newPassword: string): Observable<any> {
		const directorId = this.idSubject.getValue();
		const slot = this.slotSubject.getValue();
		const url = `${environment.API_URL}/auth/update-password?SLOT=${slot}`;
		// const url = environment.API_URL + '/auth/update-password';
		const body = {
			directorId,
			currentPassword: currentPassword,
			password: newPassword
			// slot: this.slotSubject.getValue()
		};

		return this.http.put<any>(url, body);
	}

	requestPassword(email: string, slot: string, username: string): Observable<any> {
		const directorId = this.idSubject.getValue();

		const url = `${environment.API_URL}/auth/request-password?SLOT=${slot}`;
		const body = {
			email: email,
			user_name: username
		};

		return this.http.post<any>(url, body);
	}

	generateNewSlot(directorId: string): Observable<string> {
		const url = environment.API_URL + '/auth/get-slot';
		const params = new HttpParams().set('directorId', directorId);

		return this.http.get<any>(url, { params }).pipe(
			map(response => response.data.newSlotAccount),
			catchError(error => {
				console.error('Error generating new slot:', error);
				throw error;
			})
		);
	}

	// getUserCurrentSlot() {
	//   return this.http.get<string>(environment.API_URL + '/auth/slot-account')
	// }
}
