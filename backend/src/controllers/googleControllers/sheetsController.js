const { google } = require('googleapis');
const dotenv = require('dotenv');
// const mapPropertyNamesToColumnNames = require('../../util/columnsMapping');
const dataMapping = require('../../util/columnsMapping');
const createAuthClient = require('./serviceAccountAuthController');
// const authorize = require('./googleAuthController');
const SPREADSHEET_ID = '1TKIhZDkGbAvH6WESjyCXiEpBUM4BUUXXOvvej77PzrU';

const keys = [
	'firstName',
	'lastName',
	'type',
	'email',
	'internationalTelNumber',
	'directorKey',
	'gameCode',
	'country',
	'city',
	'usage',
	'howHeard',
	'feedback',
	'comments'
];

// Initialise the New Sheet

async function createSheetWithHeaders() {
	try {
		console.log('id is :', id);

		const newKeys = dataMapping.mapPropertyNamesToColumnNames(keys);
		console.log(keys);
		const authClient = await createAuthClient();
		const service = google.sheets({ version: 'v4', auth: authClient });

		const result = await service.spreadsheets.values.update({
			SPREADSHEET_ID,
			range: 'sign-ups-test!A1',
			valueInputOption: 'RAW',
			resource: {
				values: [newKeys]
			}
		});
		console.log('updated sheet', result);
	} catch (err) {
		console.error('Error updating sheet', err);
	}
}

async function addNewSignUp(data) {
	try {
		let mappedData;
		if (data) {
			mappedData = dataMapping.mapDataWithMapping(data);
			console.log(JSON.stringify(mappedData, null, 2));
		} else {
			throw Error('no data');
		}

		const authClient = await createAuthClient();

		const sheets = google.sheets({ version: 'v4', auth: authClient });

		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: SPREADSHEET_ID,
			range: 'A:M'
		});

		// const valuesToInsert = Object.keys(propertyMapping)

		const lastRow = response.data.values ? response.data.values.length : 0;
		const range = `sign-ups-test!A${lastRow}`;
		console.log('LastRow: ', lastRow);
		// return
		sheets.spreadsheets.values.append({
			spreadsheetId: SPREADSHEET_ID,
			range: range,
			valueInputOption: 'RAW',
			insertDataOption: 'INSERT_ROWS',
			resource: {
				values: [Object.values(mappedData)]
			}
		});
		return { message: 'Row Added Successfully', data: data };
	} catch (err) {
		console.error('Error: ', err);
		throw new Error('ERR_UPDATING', err);
	}
}

module.exports = {
	createSheetWithHeaders,
	addNewSignUp
};
