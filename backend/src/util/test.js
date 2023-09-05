function createArray(mappedData) {
	return Object.keys(mappedData).map(key => ({
		[key]: mappedData[key]
	}));
}

let mappedData = {
	'First Name': 'Jack',
	'Last Name': 'Shelford',
	'Subscription Type': 'bexbronze',
	Email: 'robert.shelford@googlemail.com',
	'Director Key': '',
	'Game Code': 'InternationalNumber',
	Country: 'United Kingdom',
	City: 'London',
	Usage: 'personal',
	'How did they hear': 'test',
	'Feedback Choice': 'Yes, publish',
	'Any comments': 'this is a new comment to test',
	'Telephone Number': '+441245455455'
};

const newdata = createArray(mappedData);

console.log(JSON.stringify(newdata, null, 2));
