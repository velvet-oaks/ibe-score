const mapPropertyNamesToColumnNames = (function (propertyNames) {
	const propertyMapping = {
		firstName: 'First Name',
		lastName: 'Last Name',
		type: 'Subscription Type',
		email: 'Email',
		internationalTelNumber: 'Telephone Number',
		gameCode: 'Game Code',
		country: 'Country',
		city: 'City',
		usage: 'Usage',
		howHeard: 'How did they hear',
		feedback: 'Feedback Choice',
		comments: 'Any comments'
	};

	return function (propertyNames) {
		return propertyNames.map(
			propertyName => propertyMapping[propertyName] || propertyName
		);
	};
})();

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

function mapDataWithMapping(data) {
	const mappedDataObject = {};
	const propertyMapping = {
		firstName: 'First Name',
		lastName: 'Last Name',
		type: 'Subscription Type',
		email: 'Email',
		internationalTelNumber: 'Telephone Number',
		directorKey: 'Director Key',
		gameCode: 'Game Code',
		country: 'Country',
		city: 'City',
		usage: 'Usage',
		howHeard: 'How did they hear',
		feedback: 'Feedback Choice',
		comments: 'Any comments'
	};
	for (const key in data) {
		if (data.hasOwnProperty(key) && propertyMapping[key]) {
			mappedDataObject[propertyMapping[key]] = data[key];
		}
	}
	return mappedDataObject;
}

// const humanReadableKeys = mapPropertyNamesToColumnNames(keys);
// console.log(humanReadableKeys);

module.exports = {
	mapDataWithMapping,
	mapPropertyNamesToColumnNames
};
