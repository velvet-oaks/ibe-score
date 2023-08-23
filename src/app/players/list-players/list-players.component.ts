import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from 'src/app/services/account/users.service';

@Component({
	selector: 'app-list-players',
	templateUrl: './list-players.component.html',
	styleUrls: ['./list-players.component.scss']
})
export class ListPlayersComponent implements OnInit {
	constructor(
		private authService: AuthService,
		private usersService: UsersService
	) {}
	displayedColumns: string[] = ['name', 'email', 'id', 'delete'];
	dataSource = new MatTableDataSource<{
		id: any;
		name: any;
		email: any;
		password_hash: any;
	}>();
	dataSourceSub: Subscription;

	ngOnInit(): void {
		this.dataSourceSub = this.usersService.getUserList().subscribe(data => {
			this.dataSource.data = data.users;
			//console.log(this.dataSource)
		});
		this.usersService.updateUserList();
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		//console.log(this.dataSource)
	}

	ngOnDestroy(): void {
		this.dataSourceSub.unsubscribe();
	}
	deleteUser(user: any) {
		if (confirm('Are You Sure You want to delete user: ' + user)) {
			alert('Deleted User ' + user);
			this.authService.deleteUser(user);
		}
	}
}
