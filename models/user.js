const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");
const Email = mongoose.SchemaTypes.Email;

mongoose.set("useCreateIndex", true);

const User = new Schema({
	email: {
		type: Email,
		unique: true,
		// required: true
	},
	firstname: {
		type: String,
		default: "",
	},
	password: {
		type: String,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],
	permissions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Permission",
		},
	],
});

module.exports = mongoose.model("User", User);
