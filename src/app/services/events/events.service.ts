import { Injectable } from '@angular/core';

import * as currentEventDummy from '../../data/currentEvent.json';

import * as eventDummy from '../../data/events_new.json';
import * as playerDummy from '../../data/users.json';
import * as eventTypesDummy from '../../data/tableTypes.json';
import * as historicGamesDummy from '../../data/historic.json';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EventsService {
	public eventsHistoric: any[];
	public events: any[];
	eventsHistoricUpdated = new Subject<{ historic: any[] }>();
	eventsUpdated = new Subject<{ events: any[] }>();
	constructor(private http: HttpClient) {}

	getCurrentEvent() {
		this.http
			.get<{ events: any }>(environment.API_URL + '/event?current=true')
			.subscribe(repsonseData => {
				this.events = repsonseData.events;
				//Import Relevanent Files into var
				let currentEvent = this.events[0];
				console.log(currentEvent);
				if (currentEvent.date_ended != '') {
					return { exists: false, data: {} };
				}
				let tableTypes: object = eventTypesDummy;
				let tableType: string = currentEvent.playerConfig.type;
				let tableTypeData: any = (tableTypes as any)[tableType];
				let playerTables = new Array();
				let chunk_size: any;
				if (tableTypeData.per_side == 'variable') {
					chunk_size = currentEvent.playerConfig.team_size;
				} else {
					chunk_size = tableTypeData.per_side;
				}
				// TODO: Readinto how Swiss Pairs/ Teams work
				// Placeholder IF STATMENT

				if (1 == 1) {
					const result = currentEvent.playerConfig.players.reduce(
						(resultArray: any, item: any, index: any) => {
							const chunkIndex = Math.floor(index / chunk_size);
							if (!resultArray[chunkIndex]) {
								(resultArray as any)[chunkIndex] = []; // start a new chunk
							}

							(resultArray as any)[chunkIndex].push(item);
							return resultArray;
						},
						[]
					);

					//  console.log(result);
					let finalPlayerTable = new Array();
					let b = 0;
					for (let i = 0; i < result.length / 2; i++) {
						if (b != 0) {
							b = b + 1;
						}

						let newObj = {
							ns: result[b],
							ew: result[b + 1]
						};
						b++;
						finalPlayerTable.push(newObj);
					}
					(currentEvent.playerConfig as any)['sorted_players'] = finalPlayerTable;
					this.eventsUpdated.next({ events: currentEvent });
				} else {
					console.log(currentEvent);
					return currentEvent;
				}
			});
	}
	getCurrentEventListener() {
		return this.eventsUpdated.asObservable();
	}
	getHistoricEventListener() {
		return this.eventsHistoricUpdated.asObservable();
	}

	getHistoricEvents() {
		this.http
			.get<{ events: any }>(environment.API_URL + '/event?historic=true')
			.subscribe(responseData => {
				this.eventsHistoricUpdated.next({ historic: responseData.events });
			});
	}
	// getHistoricEvents(){
	//   let histArray = [];
	//   let histSource = historicGamesDummy;
	//   let histSourceArray = histSource.hist.histitem;
	//   for (let histIdx in histSourceArray){
	//     (histSourceArray as any)[histIdx]["item"] = Number(histIdx) + 1;
	//     histArray.push(histSourceArray[histIdx]);
	//   };
	//   return histArray;
	// }
}
