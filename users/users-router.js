const express = require('express');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const {usersModel} = require('./users-model');

//CORS Permissions
router.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/list-users', (req, res, next) => {
	usersModel.get()
		.then( users => {
			res.status(200).json({
				message : "Successfully sent the list of users",
				status : 200,
				users : users
			});
		}).catch( err => {
			res.status(500).json({
				message : "Internal server error",
				status : 500
			});
			return next();
		});
});

router.get('/list-users/:id', (req, res, next) => {
	let received_id = req.params.id;
	usersModel.get_with_id(received_id)
		.then( users => {
			if(users) {
				res.status(200).json({
					message: "Successfully sent the list of users",
					status : 200,
					users : users
				});
			}
			else {
				res.status(404).json({
					message: "User not found in the list",
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

router.get('/login-user/:email&:password', (req, res, next) => {
  const userEmail = req.params.email;
  const userPassword = req.params.password;

  usersModel.login_user(userEmail, userPassword)
  .then( user => {
    if(user){ //Successful login
      res.status(200).json({
        message: "Successful login",
        status: 200,
        userLogged: user
      });
    } else { //No possible login
      res.status(404).json({
        message : "Could not login",
        status: 404,
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

router.post('/post-user', (req, res, next) => {
	let requiredFields = ['email', 'password', 'creationDate'];

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

	let userToAdd = {
		id: uuidv4(),
		email: req.body.email,
		password: req.body.password,
		creationDate : req.body.creationDate
	}

	usersModel.post(userToAdd)
		.then(user => {
			res.status(201).json({
				message : "Successfully added the user",
				status : 201,
				user : user
			});
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error",
				status : 500
			});
      console.log(err);
			return next();
		});
});

router.put('/update-user', (req, res, next) => {
	let received_email = req.body.email;
	let received_password = req.body.password;

	let requiredFields = ['email'];
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

	if (received_email && received_password) {
		usersModel.put(received_email, received_password)
			.then( users => {
				if (users) {
					res.status(200).json({
						message : "Successfully changed the password",
						status : 200,
						user : users
					});
					return next();
				}
				else {
					res.status(404).json({
						message : "User not found in the list",
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
				message : `Missing new password in body`,
				status : 406
			});
	}
});

router.delete('/remove-user/:id', (req, res, next) => {
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

	let userID = req.params.id;

	if (userID) {
		if (userID == req.body.id) {
			usersModel.delete(userID)
				.then(user => {
					if (user) {
						res.status(204).json({
							message : "Successfully deleted the user",
							status : 204,
						});
						return next();
					}
					else {
						res.status(404).json({
							message : "User not found in the list",
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
