import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../services/auth/auth.service';

@Component({
	selector: 'app-directors',
	templateUrl: './slot-account.component.html',
	styleUrls: ['./slot-account.component.scss']
})
export class SlotAccountComponent {
	alert() {
		alert('Button Clicked');
	}
}
