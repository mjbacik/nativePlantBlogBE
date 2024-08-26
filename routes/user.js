// Two flows
// 1. User exists, email will contain link to access portal + include token
// 2. User does not exist, link will go to name first to update user

const express = require("express");
const cors = require("./cors");
const User = require("../models/user");
const bodyParser = require("body-parser");

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter
	.route("/:email")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, async (req, res, next) => {
		const user = await User.findOne({
			email: req.params.email,
		}).exec();

		if (!user) {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json({});
		} else {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json(user);
		}
	});

userRouter
	.route("/register")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.post(cors.cors, async (req, res, next) => {
		// See if a user is found first
		const existingUser = await User.findOne({
			email: req.body.email,
		}).exec();
		if (existingUser) {
			console.log("USER", existingUser);
			if (existingUser.password !== req.body.password) {
				console.log("PASSWORD MISMATCH");
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.json({ staus: "incorrectPassword" });
			} else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(existingUser);
			}
		} else {
			// Body should include user email and name
			try {
				const user = await User.create({
					email: req.body.email,
					firstname: req.body.firstName,
					password: req.body.password,
				});
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(user);
			} catch (err) {
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.json({ error: err.message });
			}
		}
	});

module.exports = userRouter;
