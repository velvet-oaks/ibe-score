import { Injectable } from '@angular/core';
import * as userDummy from '../data/users.json';
import * as bcrypt from 'bcryptjs';
import { Subject } from 'rxjs';
const salt = bcrypt.genSaltSync(10);

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private userDummys = JSON.stringify(userDummy);
	private users = JSON.parse(this.userDummys);
	newArray: any;
	usersUpdated = new Subject<{ users: any[] }>();
	constructor() {}

	// TEMP FUNCTION THIS SHOULD BE DONE IN BACKEND
	genID() {
		const timeStamp = Date.now();
		let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
		let Id = '';
		for (let i = 0; i < 7; i++) {
			let rom = Math.floor(1 + (str.length - 1) * Math.random());
			Id += str.charAt(rom);
		}
		Id += timeStamp.toString();
		return Id;
	}
	updateUserList() {
		this.newArray = [];

		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.

		for (let idx in this.users) {
			if (idx != 'length' && idx != 'default') {
				this.newArray.push(this.users[idx]);
			}
		}
		console.log(this.newArray);
		this.usersUpdated.next({ users: this.newArray });
	}
	getUserList() {
		return this.usersUpdated.asObservable();
	}
	createUser(formData: any) {
		console.log(formData);
		let newUser = {
			full_name: formData.value.name,
			user_name: formData.value.name.split(' ').join('_'),
			_id: this.genID(),
			email: formData.value.email,
			password: bcrypt.hashSync(formData.value.password, salt),
			userData: {
				lastPlay: { _date: '' },
				addDate: new Date().toLocaleDateString()
			}
		};

		//SEND USER TO BACKEND TO BE ADDED TO SERVER
		this.newArray.push(newUser);
		this.usersUpdated.next({ users: this.newArray });
		alert('User Added!');
	}
	deleteUser(id: any) {
		let user = this.newArray.findIndex((user: any) => user._id === id);
		this.newArray.splice(user, 1);
		this.usersUpdated.next({ users: this.newArray });
	}
}
