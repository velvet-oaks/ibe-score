const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const director = require('../models/director');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const path = require('path');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');
const generateSlot = require('../controllers/slotCreation');
const errorResponse = require('../controllers/errorResponse');
const userAuth = require('../controllers/userAuth.controller');
const directorController = require('../controllers/directorController');

dotenv.config();

const router = express.Router();

const saltChars =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%^&*()-_+=~';

const salt = bcrypt.genSaltSync(10, { charset: saltChars });

// Keys
const keyPass = process.env.KEY_PASS;

const RSA_PRIVATE_KEY = fs.readFileSync(
	path.join(__dirname, '../../keys/private_key.pem')
);

const decryptedKey = crypto.createPrivateKey({
	key: RSA_PRIVATE_KEY,
	passphrase: keyPass
});

// create a new hashed password for testing

router.post('/test-password', async (req, res) => {
	const testPass = {
		username: req.body.username,
		plain_text_pass: req.body.password,
		hashed_password: bcrypt.hashSync(req.body.password, salt),
		salt: salt,
		rounds: 10
	};
	const textData = `username:${testPass.username}\nplain text password:${testPass.plain_text_pass}\nhashed password:${testPass.hashed_password}\nsalt:${testPass.salt}\nrounds: ${testPass.rounds}`;
	console.log(testPass);
	fs.writeFile('/backend/data/test_pass.txt', textData, err => {
		if (err) {
			console.error(err);
			res.status(500).send('Error writing file');
		} else {
			res.send('File written');
		}
	});
});

//Login

router.post('/login', userAuth.login);

router.get('/logout', checkAuth, (req, res, next) => {
	res.clearCookie('SESSIONID');
	res.sendStatus(200);
});

// Get Users
router.get('/', checkAuth, (req, res, next) => {
	director.find().then(result => {
		res.json({ users: result });
	});
});

//Create user

router.post('/', directorController.createDirector);

//Delete user

router.delete('/', checkAuth, (req, res, next) => {
	var id = req.query.id;
	user
		.findOneAndDelete({ _id: id })
		.then(result => {
			res.json({ deletedDirector: result, err: null, message: 'Deleted director' });
		})
		.catch(error => {
			res.json({ deletedDirector: null, err: error, message: 'ERROR' });
		});
});

router.post('/check-username', (req, res, next) => {
	directorData.find({}, { user_name: 1, _id: 0 }).then(result => {
		var usernameArray = new Array();
		for (idx in result) {
			usernameArray.push(result[idx].user_name);
		}
		if (usernameArray.includes(req.body.name)) {
			res.json({ unique: false });
		} else {
			res.json({ unique: true });
		}
	});
});

// Update email route
router.put('/update-email', (req, res) => {
	const { directorId, email } = req.body;

	user
		.findByIdAndUpdate(directorId, { email }, { new: true })
		.then(updatedDirector => {
			if (!updatedDirector) {
				return res.status(404).json({ message: 'User not found' });
			}

			const config = {
				method
			};
			res
				.status(200)
				.json({ message: 'Email updated successfully', user: updatedDirector });
		})
		.catch(error => {
			res.status(500).json({ message: 'Failed to update email', error });
		});
});

// Update password route

router.put('/update-password', directorController.updatePassword);

router.post('/request-password', directorController.handlePassReq);

router.put('/addiional-slot', checkAuth, async (req, res, next) => {
	try {
		if (!req.query.id) {
			return res.status(400).json({ message: 'No ID in request' });
		}

		if (!req.query.additSlot) {
			return res.status(400).json({ message: 'No additSlot in request' });
		}

		res
			.status(200)
			.json({ message: `new slot: ${additSlot} added to account ID ${id}` });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

const newDir = () => {
	newDirector.save().then(result => {
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
				user: result,
				err: null
			});
		}
	});
};

module.exports = router;
