var mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
	Text : String,
	createdAt : {type : Date , default : Date.now},
	author : {
		id :{
			type : mongoose.Schema.Types.ObjectId ,
			ref : "User"
		},
		username : String
	},
	// likes : Number,
	// dislikes : Number
})

module.exports = mongoose.model("Answer" , answerSchema);