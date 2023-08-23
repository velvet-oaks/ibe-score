import { Component } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'app-historic-games',
	templateUrl: './historic-games.component.html',
	styleUrls: ['./historic-games.component.scss']
})
export class HistoricGamesComponent {
	historicData: Subscription;
	constructor(public eventService: EventsService) {}
	displayedColumns: string[] = ['item', 'date', 'start', 'name'];
	// dataSource = this.eventService.getHistoricEvents();
	dataSource;
	ngOnInit(): void {
		this.eventService.getHistoricEvents();
		this.historicData = this.eventService
			.getHistoricEventListener()
			.subscribe(data => {
				this.dataSource = new MatTableDataSource(data.historic);
				console.log(data.historic);
			});
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		//   console.log(this.dataSource)
	}
}
