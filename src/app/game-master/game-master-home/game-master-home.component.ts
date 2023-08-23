import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-game-master-home',
	templateUrl: './game-master-home.component.html',
	styleUrls: ['./game-master-home.component.scss']
})
export class GameMasterHomeComponent {
	constructor(private authService: AuthService) {}

	checkForLogout(event) {
		console.log(event);
		if (event.index == 4) {
			this.authService.logout();
		}
	}
}
