var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    author : {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"
        },
        username: String
    },
    createdAt : {type : Date ,default : Date.now},
    description : String,
	answers : [
		{
			type : mongoose.Schema.Types.ObjectId,
         	ref : "Answer"
		}
	]
    // likes : Number,
    // dislikes : Number
});

module.exports = mongoose.model("Question",questionSchema);
