import {
	Component,
	ViewEncapsulation,
	ViewChild,
	HostListener
} from '@angular/core';
import { EventsService } from './services/events/events.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { AuthService } from './services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { filter } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	@ViewChild('drawer') drawer: MatDrawer;
	@HostListener('document:click', ['$event'])
	closeDrawerOnClick(event: any) {
		// console.log("clicked", event)
		if (event.target.id == 'content') {
			this.drawer.close();
		}
	}
	openNav() {
		this.drawer.open();
	}
	title = 'ibe-score';
	onDisplay?: boolean = true;

	constructor(
		public eventService: EventsService,
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		// this.router.events
		// 	.pipe(filter(event => event instanceof NavigationEnd))
		// 	.subscribe(() => {
		// 		const currentRoute = this.route.snapshot.routeConfig?.path;
		// 		console.log(currentRoute);
		// 		if (currentRoute === 'registration') {
		// 			console.log(currentRoute);
		// 			this.onDisplay = false;
		// 		}
		// 		{
		// 			this.onDisplay = true;
		// 		}
		// 	});
	}
	ngOnInit(): void {
		this.authService.autoAuth();
		//console.log('env'+environment.API_URL);
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
	}
	clickOutside() {
		console.log('clicked outside');
	}
}
