const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let userSchema = mongoose.Schema({
	id : {type : Number, required : true, unique : true},
	email : {type : String, required : true, unique : true},
	password : {type : String, required : true},
	creationDate : {type : Date, required : true}
});

let Users = mongoose.model("Users", userSchema);

const usersModel = {
	get : function() {
		return Users.find()
			.then( users => {
				return users;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	get_with_id : function(received_id) {
		return Users.findOne({id : received_id})
			.then(users => {
				return users;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	post : function(newUser) {
		return Users.create(newUser)
			.then( user => {
				return user;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	put : function(received_email, received_password) {
		return Users.findOneAndUpdate({email : received_email}, {$set : {password : received_password}}, {new : true})
			.then(user => {
				return user;
			})
			.catch(err => {
				throw new Error(err);
			});
	},

	delete : function(received_id) {
		return Users.findOneAndDelete({id : received_id})
			.then(user => {
				return user;
			})
			.catch( err => {
				throw new Error(err);
			});
	}
}

module.exports = {usersModel};