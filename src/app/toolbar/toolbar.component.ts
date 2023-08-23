import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { PasswordResetComponent } from '../directors/password-reset/password-reset.component';
import { LoginSignupDialogComponent } from '../dialogs/login-signup-dialog/login-signup-dialog.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Observable, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
	slot: string;
	username: string;
	private destroy$ = new Subject<void>();
	@ViewChild('drawer') drawer: MatDrawer;

	@Output('openNav') openNav = new EventEmitter<any>();

	isAuthed: Boolean;
	isAuthedSub: Subscription;
	slotAccount: string;
	constructor(
		public dialog: MatDialog,
		public authService: AuthService,
		private renderer: Renderer2
	) {}
	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.isAuthedSub = this.authService.getisAuthed().subscribe(data => {
			this.isAuthed = data;
			console.log(this.isAuthed);
		});
		this.authService.checkAuthStatus();

		this.authService.username$.subscribe(username => {
			console.log('Toolbar username subscription: ', username);
			if (username === 'undefined') {
				this.username = localStorage.getItem('slot');
			} else {
				this.username = username;
			}
		});

		this.authService.slot$.subscribe(slot => {
			console.log('toolbar component subscription slot ', slot);
			if (slot === 'undefined') {
				this.slot = 'No slot found';
			} else {
				this.slot = slot;
			}
		});
	}

	openForgotPassword(): void {
		const dialogRef = this.dialog.open(PasswordResetComponent, {
			width: '600px',
			height: '360px'
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('Dialog for PasswordResetComponent closed');
		});
	}

	openDialog(type: any): void {
		const dialogRef = this.dialog.open(LoginSignupDialogComponent, {
			data: { type: type }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
	openNavFun() {
		this.openNav.emit();
		console.log('ran');
	}
}
