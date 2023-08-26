import { AccountType } from './typeModel';

export const accountTypes: AccountType[] = [
	{
		name: 'BRONZE BASIC',
		message: 'personal use or when no publication of results needed',
		typeCode: 'bexbronze'
	},
	{
		name: 'SILVER SUCCESS',
		message:
			'great for do-it-yourself scoring and result/masterpoint only publication',
		typeCode: 'bexsilver'
	},
	{
		name: 'VIRTUAL GOLD',
		message:
			'when extra service is required eg online directing, IBEx remote scorers or director support',
		typeCode: 'bexgold'
	},
	{
		name: 'ENTERPRISE',
		message:
			'we will use multiple game codes and might require customised support for eg online directing, movements and training',
		typeCode: 'bexent'
	},
	{
		name: "I'm not sure",
		message:
			'We will revert all game codes to a FREE personal account signup (BEX BRONZE) after April 2023 unless you tell us otherwise – please select SILVER or GOLD to indicate your likely preference going forward - if you are not sure please say and we will do our best to help you choose the best option for you.',
		typeCode: 'bexbronze'
	}
];
