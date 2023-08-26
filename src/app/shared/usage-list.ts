import { UsageModel } from './usageModel';

export const usageList = [
	{ value: 'personal', label: '(team games and with friends only)', checked: true },
	{
		value: 'bridgeClub',
		label: 'At the Bridge Club - Duplicates/ Individuals Only',
		checked: false
	},
	{
		value: 'multiSession',
		label: 'To score multi Session/section/day Bridge Tournaments',
		checked: false
	},
	{ value: 'multiSelect', label: 'Some or all of the above', checked: false }
];
