const express = require("express");
const cors = require("./cors");
const Post = require("../models/post");
const Blog = require("../models/blog");
const Response = require("../models/response");
const User = require("../models/user");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");

const postRouter = express.Router();

postRouter.use(bodyParser.json());

postRouter
	.route("/create")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.post(cors.cors, async (req, res, next) => {
		const post = await Post.create({
			user: req.body.userId,
			title: req.body.title,
			text: req.body.text,
		});

		const updatedBlog = await Blog.findByIdAndUpdate(
			req.body.blogId,
			{
				$push: { blogPosts: post._id },
			},
			{ returnOriginal: false },
		);

		const updatedUser = await User.findByIdAndUpdate(
			req.body.userId,
			{
				$push: { posts: post._id },
			},
			{ returnOriginal: false },
		);

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(post);
	});

postRouter
	.route("/getForUser/:user_id")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, async (req, res, next) => {
		const user = await User.findById(req.params.user_id)
			.populate("posts")
			.exec();

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(user.posts);
	});

module.exports = postRouter;
