const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const director = require('../models/director'); // Assuming you have a model named 'director'
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const generateSlot = require('./slotCreation');
const genPass = require('./generatePassword');
const sendMail = require('./nodemailer');
const { error } = require('console');
dotenv.config();

// Keys
const keyPass = process.env.KEY_PASS;
const RSA_PRIVATE_KEY = fs.readFileSync(
	path.join(__dirname, '../../keys/private_key.pem')
);
const decryptedKey = crypto.createPrivateKey({
	key: RSA_PRIVATE_KEY,
	passphrase: keyPass
});

// bcrypt salt constant
const saltChars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%^&*()-_+=~';
const salt = bcrypt.genSaltSync(10, { charset: saltChars });

let slotExists = true;
// Function to check if the slot exists in the database
async function checkSlotExists(slot) {
	try {
		console.log('at checkSlotExists() slot: ', slot);
		// Perform a database query to check if the slot exists
		const existingDirector = await director.findOne({
			slot: { $regex: new RegExp(`^${slot}$`, 'i') }
		});

		if (existingDirector) {
			console.log('existing director: ', existingDirector);
			slotExists = true;
			// Slot already exists, throw an error
			throw new Error(`Slot ${slot} already exists`);
		} else {
			slotExists = false;
		}
		return slotExists;
	} catch (err) {
		// Catch any errors that occur during the database query
		console.error('Internal Server Error', err);
		throw err;
	}
}

async function createDirector(req, res, next) {
	console.log(req.body.slot);
	let slot = '';
	if (!req.body.slot) {
		slot = generateSlot();
	} else slot = req.body.slot;
	const newSlot = {
		slot: slot
	};
	const password = req.body.password;

	const oldSlot = req.body.slot ? req.body.slot : newSlot.slot;
	const hashedPassword = bcrypt.hashSync(req.body.password, salt);
	let victorError = false;
	try {
		// Perform a database query to check if the slot exists
		const existingDirector = await director.findOne({
			slot: { $regex: new RegExp(`^${oldSlot}$`, 'i') }
		});

		if (existingDirector) {
			// Slot already exists, throw an error
			console.log();
			throw new Error('SLOT_EXISTS');
		} else {
			try {
				await sendData(
					req.body.full_name,
					req.body.email,
					req.body.tel_phone,
					req.body.slot,
					req.body.country,
					req.body.type,
					hashedPassword
				);
			} catch (err) {
				victorError = true;
			}

			if (victorError) {
				return res.status(500).json({ message: 'VIC_ERROR', err });
			} else {
				// Slot does not exist, proceed with saving the newDirector
				const mailOptions = {
					email: req.body.email,
					slot: req.body.slot,
					full_name: req.body.full_name,
					user_name: req.body.user_name,
					password: password
				};
				if (mailOptions) {
					const result = await sendMail.sendNodeMail(mailOptions);
					console.log(result);
				} else {
					console.log('Failed to send welcome email');
				}

				const newDirector = new director({
					full_name: req.body.full_name,
					user_name: req.body.user_name,
					type: req.body.type,
					valid_user: true,
					email: req.body.email,
					slot: oldSlot,
					slots: [newSlot],
					tel_phone: req.body.tel_phone,
					password: hashedPassword,
					salt: salt,
					country: req.body.country,
					userData: {
						addDate: req.body.userData.addDate,
						lastPlayed: req.body.userData.lastPlayed,
						pp_n: req.body.userData.pp_n
					}
				});

				// Save the newDirector to the database
				const result = await newDirector.save();
				// check result
				if (!result) {
					throw new Error('Error saving to the database');
				} else {
					console.log('director saved: ', result);
					// Generate a JWT token and send it to the front end
					const jwtBearerToken = jwt.sign({}, decryptedKey, {
						algorithm: 'RS256',
						expiresIn: '1h',
						subject: result.slot,
						allowInsecureKeySizes: true
					});

					if (!process.env.ALLOW_LOCAL_STORAGE) {
						res.cookie('SESSIONID', jwtBearerToken, {
							httpOnly: true,
							secure: true,
							maxAge: 3600000,
							allowInsecureKeySizes: true
						});
					}

					// Respond with success and the JWT token
					res.status(200).json({
						message: 'DIRECTOR_CREATED',
						idToken: jwtBearerToken,
						expires: 3600000,
						user: result,
						err: null
					});
				}
			}
		}
	} catch (err) {
		console.error('Internal Server Error', err);
		res.status(400).json({ message: 'ERROR', err: err.message, user: null });

		// If the slot already exists or any other error occurs, send an error response to the front end
	}
}

async function sendData(
	fullName,
	email,
	telPhone,
	slot,
	country,
	type,
	hashedPassword
) {
	console.log('about to send to Victor');
	const transformedData = `trial\n${fullName}\n${email}\n${telPhone}\n${slot}\n${country}\n${type},${hashedPassword}\n`;
	console.log(transformedData);
	// return;

	try {
		const headers = { 'Content-Type': 'text/plain' };
		const response = await axios.post(process.env.VICTOR_SERVER, transformedData, {
			headers: headers
		});
		console.log('createDirector :', response.data);

		const lines = response.data.split();
		result = lines[0].trim().toLowerCase();
		if (result === 'success') {
			console.log("Success from Victor's Server");
		} else {
			throw new Error('VICTOR_ERROR');
		}
		// console.log(response);
	} catch (error) {
		console.log(error.message);
		throw err;
	}
}

async function updatePassword(req, res, next) {
	// console.log(req)
	// console.log(req.body);
	// console.log(req.query.SLOT);
	const slot = req.query.SLOT;
	const { directorId, currentPassword, password } = req.body;
	const hashedNewPassword = bcrypt.hashSync(password, salt);
	const data = {
		slot: slot,
		currentPassword: currentPassword,
		hashedNewPassword: hashedNewPassword
	};

	// Attempt to update Victor's data
	try {
		const result = await sendUpdatedPass(data);
		if (result.errorCode) {
			return res
				.status(500)
				.json({ message: result.message, err: result.errorCode });
		} else {
			// Upon successful sending, update our database
			let updatedDirector;
			const updateDatabase = async () => {
				try {
					updatedDirector = await director.findByIdAndUpdate(
						directorId,
						{ password: hashedNewPassword },
						{ new: true }
					);
					if (!updatedDirector) {
						throw new Error('DIR_NOT_FOUND');
					}
					// Password update successful
					// Any other logic related to successful update can be added here
					return updatedDirector; // Optionally, return the updatedDirector if needed
				} catch (err) {
					console.error('Failed to update database', err);
					throw err; // Re-throw the error to be handled by the calling code
				}
			};

			try {
				await updateDatabase();
				// Upon total success
				res.status(200).json({
					message: 'Password updated successfully',
					director: updatedDirector
				});
			} catch (err) {
				console.error('Error updating password', err);
				return res.status(500).json({ message: 'Internal Server Error', err: err });
			}
		}
	} catch (err) {
		console.error('Error sending to Victor', err);
		return res.status(500).json({ message: 'Internal Server Error', err: err });
	}
}

async function sendUpdatedPass(data) {
	try {
		console.log('Sending request to Victor with the following data:');
		console.log('Slot:', data.slot);
		console.log('Current Password:', data.currentPassword);
		console.log('Hashed New Password:', data.hashedNewPassword);

		const url = process.env.UPDATE_PASS;
		const string = `${data.slot}\nDIRPASS\n${data.currentPassword}\n${data.hashedNewPassword}`;
		const headers = { 'Content-Type': 'text/plain' };

		console.log('const string is: \n', string);

		const response = await axios.post(url, string, { headers: headers });
		let result;
		if (response) {
			const lines = response.data.split('\n');
			result = lines[0].trim().toLowerCase();
			console.log('-----\nresult from V: ', result, '\n-----');
			if (result === 'success') {
				console.log('Success updating password on Victor server');
			} else {
				const error = new Error('Sent to victor fine, but did not update');
				error.errorCode = 'NOT_UPDATE';
				error.result = result;
				throw error;
			}
		} else {
			const error = new Error("Error sending to victor's server");
			error.errorCode = 'VICTOR_ERROR';
			throw error;
		}
		return { result };
	} catch (err) {
		console.error('Error Sending UpdatedPassword', err);
		// console.error('Stack Trace', err.stack);
		throw err;
	}
}
async function findContactBuildMailOptions(slot, email, user_name, password) {
	console.log('findContactBuildMailOptions() called');
	try {
		const contactDetails = await director.findOne({ slot, user_name });

		if (contactDetails) {
			console.log('contactDetails: ', contactDetails);
			if (contactDetails.email !== email) {
				console.log('Incorrect Email', email);
				return res.status(401).json({ message: 'Incorrect Email', email });
			} else {
				const mailOptions = {
					email: contactDetails.email,

					fullName: contactDetails.full_name,
					user_name: user_name,
					slot: contactDetails.slot,
					newPassword: password
				};
				console.log('mailOptions: ', mailOptions);
				return mailOptions;
			}
		} else {
			console.log(`no director with Game Code ${slot} found`);
			return null;
		}
	} catch (err) {
		console.error('Error finding contact details', err);
		throw err;
	}
}

async function updateDatabase(slot, user_name, hashedNewPassword) {
	try {
		updatedDirector = await director.findOneAndUpdate(
			{ slot: slot },
			{ user_name: user_name },
			{ $set: { password: hashedNewPassword } }
		);
		if (!updatedDirector) {
			throw new Error('DIR_NOT_FOUND');
		}
		// Password update successful
		// Any other logic related to successful update can be added here
		return updatedDirector; // Optionally, return the updatedDirector if needed
	} catch (err) {
		console.error('Failed to update database', err);
		throw err; // Re-throw the error to be handled by the calling code
	}
}

async function handlePassReq(req, res) {
	const slot = req.query.SLOT;
	const { email, user_name } = req.body;
	const password = genPass();
	const hashedNewPassword = bcrypt.hashSync(password, salt);
	console.log('generated password', password);
	console.log('hashedNewPassword', hashedNewPassword);
	const data = {
		slot: slot,
		hashedNewPassword: hashedNewPassword
	};
	console.log('data is: ', data);
	// return
	let updatedDirector;

	try {
		const mailOptions = await findContactBuildMailOptions(
			slot,
			email,
			user_name,
			password
		);
		const victorData = {
			slot: slot,
			currentPassword: process.env.MASTER_PASS,
			hashedNewPassword: hashedNewPassword
		};

		if (mailOptions) {
			console.log(mailOptions);
			const result = await sendMail.sendNewPass(mailOptions);

			console.log(result);
		} else {
			console.error('Failed to send email');
		}

		const result = await sendUpdatedPass(victorData);
		if (result.errorCode) {
			return res
				.status(500)
				.json({ message: result.message, err: result.errorCode });
		}
		await updateDatabase(slot, user_name, hashedNewPassword);

		// console.log(mailOptions, success);
		// Upon total success
		res.status(200).json({
			message: 'Password updated successfully',
			director: updatedDirector
		});
	} catch (err) {
		console.error('Error generating new password', err);
		res.status(500).json({ message: 'Internal Server Error', err });
	}
}

// async function updatePassword(req, res, next) {
// 	console.log(req.body);
// 	console.log(req.query.SLOT);
// 	const slot = req.query.SLOT;
// 	const { directorId, currentPassword, password } = req.body;
// 	const hashedNewPassword = bcrypt.hashSync(password, salt);
// 	let victorError = false;
// 	let errorType;
// 	const data = {
// 		slot: slot,
// 		currentPassword: currentPassword,
// 		password: hashedNewPassword
// 	};

// 	// attempt to update victor's data
// 	try {
// 		console.log(data);
// 		// return;
// 		// await sendUpdatedPass(slot, directorId, currentPassword, hashedNewPassword);
// 		await sendUpdatedPass(data);
// 	} catch (err) {
// 		victorError = true;
// 		console.error('Error sending to Victor', err);
// 		throw err;
// 	}
// 	if (victorError) {
// 		return res.status(500).json({ message: 'SEND_ERROR' });
// 	} else {
// 		let updatedDirector;
// 		// upon successful sending, update our database
// 		const updateDatabase = async () => {
// 			try {
// 				updatedDirector = await director.findByIdAndUpdate(
// 					directorId, // Replace directorId with the actual ID of the director to update
// 					{ password: hashedNewPassword },
// 					{ new: true }
// 				);
// 				if (!updatedDirector) {
// 					errorType = 'DIR_NOT_FOUND';
// 					throw new Error(errorType);
// 				}
// 				// Password update successful
// 				// Any other logic related to successful update can be added here
// 				return updatedDirector; // Optionally, return the updatedDirector if needed
// 			} catch (err) {
// 				console.error('Failed to update database', err);
// 				throw err; // Re-throw the error to be handled by the calling code
// 			}
// 		};
// 		try {
// 			await updateDatabase();
// 			// upon total success
// 			res.status(200).json({
// 				message: 'Password updated successfully',
// 				director: updatedDirector
// 			});
// 		} catch (err) {
// 			// if (errorType === 'DIR_NOT_FOUND') {
// 			// 	res.status(400).json({ message: 'Director not found' });
// 			// } else if (errorType === '') {
// 			// 	res.status(500).json({ message: 'Internal Server Error' });
// 			// }

// 			console.error(err)
// 			return res.status(500)
// 		}
// 	}
// }

// async function sendUpdatedPass(data) {
// 	console.log(data);
// 	// return
// 	// async function sendUpdatedPass(slot, currentPass, hashedNewPassword) {
// 	try {
// 		const url = process.env.UPDATE_PASS;
// 		// const string = `${slot}\nDIRPASS\n${currentPass}\n${hashedNewPassword}`;
// 		const string = `${data.slot}\nDIRPASS\n${data.currentPass}\n${data.hashedNewPassword}`;
// 		const headers = { 'Content-Type': 'text/plain' };

// 		const response = await axios.post(url, string, {
// 			headers: headers
// 		});

// 		if (!response) {
// 			return {
// 				message: "Error sending to victor's server",
// 				errorCode: 'VICTOR_ERROR',
// 				result: 'Unknown error occurred'
// 			};
// 		}

// 		console.log(response.data);
// 		if (response) {
// 			const lines = response.data.split();
// 			const result = lines[0].trim().toLowerCase();
// 			if (result === 'success') {
// 				console.log("Success updating password on Victor's server");
// 			} else {
// 				return {
// 					message: 'Sent to victor fine, but did not update',
// 					errorCode: 'NOT_UPDATE',
// 					result: response?.data
// 				};
// 			}
// 		}
// 	} catch (err) {
// 		console.error('Error Sending UpdatedPassword', err);
// 		console.error('stack trace', err.stack);
// 		return {
// 			message: "Error sending password to Victor's server",
// 			errorCode: 'SEND_ERROR',
// 			result: 'Unknown error occurred'
// 		};
// 	}
// }

module.exports = {
	createDirector,
	updatePassword,
	handlePassReq
};
