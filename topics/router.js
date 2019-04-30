const express = require('express');
const router = express.Router();
const {topicsModel} = require('./model');


//Next is added instead of ".send('Finish'), que los vergas no usamos, in order to finish the execution and send only one message"
router.get('/list-topics', (req, res, next) => {
	topicsModel.get()
		.then( topics => {
			res.status(200).json({
				message : "Successfully sent the list of topics",
				status : 200,
				topics : topics
			});
		}).catch( err => {
			res.status(500).json({
				message : "Internal server error",
				status : 500
			});
			return next();
		});
});

router.get('/list-topics/:id', (req, res, next) => {
	let received_id = req.params.id;
	topicsModel.get_with_id(received_id)
		.then( topics => {
			if(topics) {
				res.status(200).json({
					message: "Successfully sent the list of topics",
					status : 200,
					topics : topics
				});
			}
			else {
				res.status(404).json({
					message: "Topic not found in the list",
					status: 404
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
			return next();
		});
});

router.post('/post-topic', (req, res, next) => {
	let requiredFields = ['id', 'name', 'words', 'creatorEmail'];

	for (let i = 0; i < requiredFields.length; i++) {
		let currentField = requiredFields[i];
		if (!(currentField in req.body)) {
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	let topicToAdd = {
		id: req.body.id,
		name: req.body.name,
		words: req.body.words,
		creatorEmail: req.body.creatorEmail
	}

	topicsModel.post(topicToAdd)
		.then(topic => {
			res.status(201).json({
				message : "Successfully added the topic",
				status : 201,
				topic : topic
			});
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
			return next();
		});
});

router.put('/update-topic', (req, res, next) => {
	let received_name = req.body.name;
	let received_words = req.body.words;

	let requiredFields = ['name'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	if (received_name && received_words) {
		topicsModel.put(received_name, received_words)
			.then( topics => {
				if (topics) {
					res.status(200).json({
						message : "Successfully modified words on topic",
						status : 200,
						topic : topics
					});
					return next();
				}
				else {
					res.status(404).json({
						message : "Topic not found in the list",
						status : 404
					});
					return next();
				}
			})
			.catch( err => {
				res.status(500).json({
					message: "Internal server error",
					status : 500
				});
				return next();
			});
	}
	else {
		res.status(406).json({
				message : `Missing new words in body`,
				status : 406
			});
	}
});

router.delete('/remove-topic/:id', (req, res, next) => {
	let requiredFields = ['id'];

	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];

		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	let topicID = req.params.id;

	if (topicID) {
		if (topicID == req.body.id) {
			topicsModel.delete(topicID)
				.then(topic => {
					if (topic) {
						res.status(204).json({
							message : "Successfully deleted the topic",
							status : 204,
						});
						return next();						
					}
					else {
						res.status(404).json({
							message : "Topic not found in the list",
							status : 404
						});
						return next();						
					}
				})
				.catch( err => {
					res.status(500).json({
						message: "Internal server error",
						status : 500
					});
					return next();
				});
		}
		else {
			res.status(406).json({
				message : `Different entered IDs`,
				status : 406
			});
			return next();
		}
	}
});

module.exports = router;