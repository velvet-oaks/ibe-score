import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
//import html2canvas from 'html2canvas';
import { FormControl, FormGroup } from '@angular/forms';
import { EventsService } from '../../services/events/events.service';
import { MatTableDataSource } from '@angular/material/table';

import playerDummy from '../../data/players.json';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/account/users.service';

export interface tableData {
	table: any;
	ns_1: string;
	ns_2: string;
	ew_1: string;
	ew_2: string;
	direction: string;
	venue: string;

	stratification_1: string;
	sitter_1: string;
	adjustments_1: string;
	handicaps_1: string;
	labels_1: string;
	abbreiviations_1: string;

	stratification_2: string;
	sitter_2: string;
	adjustments_2: string;
	handicaps_2: string;
	labels_2: string;
	abbreiviations_2: string;

	lunch_times: string;
}

@Component({
	selector: 'app-player-table',
	templateUrl: './player-table.component.html',
	styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent {
	eventSub: Subscription;
	playerSub: Subscription;
	constructor(
		public eventService: EventsService,
		public authService: AuthService,
		private usersService: UsersService
	) {}
	form: FormGroup = new FormGroup({
		id: new FormControl(false),
		description: new FormControl(false)
	});

	//displayedColumns: string[] = ['table', 'venue','board_colors','stratification_1','stratification_2','sitter_1','sitter_2','adjustments_1','east_west','adjustments_2','handicaps_1','handicaps_2','labels_1','labels_2','abbreiviations_1','abbreiviations_2'];
	displayedColumns: string[] = [
		'table',
		'venue',
		'board_colors',
		'stratification_1',
		'sitter_1',
		'adjustments_1',
		'handicaps_1',
		'labels_1',
		'abbreiviations_1',
		'north_south',
		'stratification_2',
		'sitter_2',
		'adjustments_2',
		'handicaps_2',
		'labels_2',
		'abbreiviations_2',
		'east_west'
	];

	columnDefinitions = [
		{ def: 'table', label: 'Table', hide: false },
		{ def: 'venue', label: 'Description', hide: true },
		{ def: 'board_colors', label: 'Description', hide: true },

		{ def: 'stratification_1', label: 'Description', hide: true },
		{ def: 'sitter_1', label: 'Description', hide: true },
		{ def: 'adjustments_1', label: 'Description', hide: true },
		{ def: 'handicaps_1', label: 'Description', hide: true },
		{ def: 'labels_1', label: 'Description', hide: true },
		{ def: 'abbreiviations_1', label: 'Description', hide: true },
		{ def: 'north_south', label: 'Description', hide: false },

		{ def: 'stratification_2', label: 'Description', hide: true },
		{ def: 'sitter_2', label: 'Description', hide: true },
		{ def: 'adjustments_2', label: 'Description', hide: true },
		{ def: 'handicaps_2', label: 'Description', hide: true },
		{ def: 'labels_2', label: 'Description', hide: true },
		{ def: 'abbreiviations_2', label: 'Description', hide: true },
		{ def: 'east_west', label: 'Description', hide: false }

		// { def: 'lunch_times', label: 'Description', hide: false},
	];

	dropdownValues = [
		{
			values: ['venue'],
			display: 'Venue'
		},
		{
			values: ['stratification_1', 'stratification_2'],
			display: 'Stratification'
		},
		{
			values: ['sitter_1', 'sitter_2'],
			display: 'Sitters'
		},
		{
			values: ['adjustments_1', 'adjustments_2'],
			display: 'Adjustments'
		},
		{
			values: ['handicaps_1', 'handicaps_2'],
			display: 'Handicaps'
		},
		{
			values: ['labels_1', 'labels_2'],
			display: 'Labels'
		},
		{
			values: ['abbreiviations_1', 'abbreiviations_2'],
			display: 'Abbreiviations'
		}
	];
	hiddenColumns: string[] = [
		'venue',
		'board_colors',
		'stratification_1',
		'stratification_2',
		'sitter_1',
		'sitter_2',
		'adjustments_1',
		'adjustments_2',
		'handicaps_1',
		'handicaps_2',
		'labels_1',
		'labels_2',
		'abbreiviations_1',
		'abbreiviations_2'
	];
	eventData: any;
	playerData: any;

	//splitTables = this.rawData.playerTables.join("&");

	eventName: any;
	dataSource: any;
	prevValues = [];
	changeDropdown(valuesR: any) {
		let values = valuesR.value;
		// console.log(values)
		if (this.prevValues.length != 0 || values == undefined) {
			for (let idx in this.prevValues) {
				// console.log(this.prevValues)
				for (let otherIdx in this.columnDefinitions) {
					if (this.columnDefinitions[otherIdx].def == this.prevValues[idx]) {
						this.columnDefinitions[otherIdx].hide = true;
					}
				}
			}
			this.prevValues = [];
		}
		for (let idx in values) {
			for (let otherIdx in this.columnDefinitions) {
				if (this.columnDefinitions[otherIdx].def == values[idx]) {
					//  console.log(values[idx])
					this.columnDefinitions[otherIdx].hide = false;
					this.prevValues = values;
				}
			}
		}
	}

	ngOnInit(): void {
		this.eventService.getCurrentEvent();
		this.eventSub = this.eventService.getCurrentEventListener().subscribe(data => {
			this.eventData = data.events;
			let root = this;
			setTimeout(function () {
				root.playerData = root.usersService.getUser();
				let playerArray = root.playerData;
				console.log(root.eventData);
				root.eventName = root.eventData.name;
				let tableData: tableData[] = [];

				let playerTable = root.eventData.playerConfig.sorted_players;
				console.log(playerTable);
				for (let idx in playerTable) {
					let north_south = playerTable[idx].ns;
					let east_west = playerTable[idx].ew;
					playerTable[idx]['table'] = Number(idx) + 1;
					for (let innerIdx in north_south) {
						let findId = north_south[innerIdx];
						let foundUser = playerArray.filter(x => x._id === findId)[0];
						playerTable[idx].ns[innerIdx] = foundUser;
					}
					for (let innerIdx in east_west) {
						let findId = east_west[innerIdx];
						let foundUser = playerArray.filter(x => x._id === findId)[0];
						playerTable[idx].ew[innerIdx] = foundUser;
					}
				}
				for (let i in playerTable) {
					//console.log(playerTable[i].table)
					let newObj = {
						table: playerTable[i].table,
						ns_1: playerTable[i].ns[0],
						ns_2: playerTable[i].ns[1],
						ew_1: playerTable[i].ew[0],
						ew_2: playerTable[i].ew[1],
						venue: 'london',
						board_colors: 'red',
						direction: 'string',
						stratification_1: 'strat',
						sitter_1: 'sitter',
						adjustments_1: 'adj',
						handicaps_1: 'handi',
						labels_1: 'label',
						abbreiviations_1: 'abre',
						stratification_2: 'string',
						sitter_2: '',
						adjustments_2: 'string',
						handicaps_2: 'string',
						labels_2: 'string',
						abbreiviations_2: 'string',
						lunch_times: 'string'
					};
					//   console.log(newObj)
					tableData.push(newObj);
				}
				console.log(tableData);
				root.dataSource = new MatTableDataSource(tableData);
			}, 500);

			//console.log(this.eventData)
		});

		console.log(this.getDisplayedColumns());
	}
	getDisplayedColumns(): string[] {
		return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
	}

	// public openPDF(): void {
	//   let DATA: any = document.getElementById('htmlData');
	//   html2canvas(DATA).then((canvas) => {
	//     let fileWidth = 208;
	//     let fileHeight = (canvas.height * fileWidth) / canvas.width;
	//     const FILEURI = canvas.toDataURL('image/png');
	//     let PDF = new jsPDF('p', 'mm', 'a4');
	//     let position = 0;
	//     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
	//     PDF.save('angular-demo.pdf');
	//   });
	// }
}
