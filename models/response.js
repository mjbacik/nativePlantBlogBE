const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Response = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		text: {
			type: String,
		},
		images: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Image",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Response", Response);
