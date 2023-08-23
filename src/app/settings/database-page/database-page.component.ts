import { Component } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/services/account/users.service';

@Component({
	selector: 'app-database-page',
	templateUrl: './database-page.component.html',
	styleUrls: ['./database-page.component.scss']
})
export class DatabasePageComponent {
	constructor(
		public eventService: EventsService,
		public userService: UsersService
	) {}
	displayedColumns: string[] = ['name', 'added', 'lastplay'];
	dataSource = new MatTableDataSource<{ name: any; added: any; lastplay: any }>();
	dataSourceSub: Subscription;
	//dataSource = this.authService.getUsers();
	ngOnInit(): void {
		this.dataSourceSub = this.userService.getUserList().subscribe(data => {
			this.dataSource.data = data.users;
			//console.log(this.dataSource)
		});
		console.log(this.dataSource);
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
	}
}
