const express = require("express");
const cors = require("./cors");
const Blog = require("../models/blog");
const Response = require("../models/response");
const User = require("../models/user");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { v4: uuid } = require("uuid");

const blogRouter = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const AWS = require("aws-sdk");

blogRouter.use(bodyParser.json());

blogRouter
	.route("/create")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.post(cors.cors, async (req, res, next) => {
		const blog = await Blog.create({
			title: req.body.title,
			subject: req.body.subject,
		});

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(blog);
	});

// Individual blog page with blog posts
blogRouter
	.route("/blog/:blog_id")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, async (req, res, next) => {
		console.log("GET BLOG BY ID");
		const blog = await Blog.findById(req.params.blog_id)
			.populate("headerImage")
			.populate({
				path: "blogPosts",
				populate: [
					{
						path: "user",
						model: "User",
					},
				],
			})
			.exec();

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(blog);
	});

// For home page
blogRouter
	.route("/getAll")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, async (req, res, next) => {
		const blogs = await Blog.find()
			.populate("blogPosts")
			.populate("headerImage")
			.exec();

		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(blogs);
	});

blogRouter
	.route("/uploadResponseImages")
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.post(cors.cors, upload.array("images"), async (req, res, next) => {
		const files = req.files;
		const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

		const s3bucket = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION,
		});

		try {
			/// Upload to AWS and get S3 link back
			const uploadedImages = [];
			for (const file of files) {
				try {
					var imageID = uuid();
					var params = {
						Bucket: process.env.AWS_BUCKET_NAME,
						Key: imageID,
						Body: file.buffer,
						ContentType: file.mimetype,
						ACL: "public-read",
					};
					const data = await s3bucket.upload(params).promise();
					uploadedImages.push({ link: data.Location });
				} catch (err) {
					console.log("AWS Upload Error ", err);
				}
			}

			const images = await Image.insertMany(uploadedImages);
			const imageIDs = images.map((image) => image._id);

			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json({ image_ids: imageIDs });
		} catch (err) {
			next(err);
		}
	});

module.exports = blogRouter;
