const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let topicSchema = mongoose.Schema({
	id : {type : Number, required : true, unique : true},
	name : {type : String, required : true, unique : true},
	words : {type : [String], required : true},
	creatorEmail : {type : String, required : true}
});

let Topics = mongoose.model("Topics", topicSchema);

const topicsModel = {
	get : function() {
		return Topics.find()
			.then( topics => {
				return topics;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	get_with_id : function(received_id) {
		return Topics.findOne({id : received_id})
			.then(topics => {
				return topics;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	post : function(newTopic) {
		return Topics.create(newTopic)
			.then( topic => {
				return topic;
			})
			.catch( err => {
				throw new Error(err);
			});
	},

	put : function(received_name, received_words) {
		return Topics.findOneAndUpdate({name : received_name}, {$set : {words : received_words}}, {new : true})
			.then(topic => {
				return topic;
			})
			.catch(err => {
				throw new Error(err);
			});
	},

	delete : function(received_id) {
		return Topics.findOneAndDelete({id : received_id})
			.then(topic => {
				return topic;
			})
			.catch( err => {
				throw new Error(err);
			});
	}
}

module.exports = {topicsModel};