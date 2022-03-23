const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const video = require("ffmpeg/lib/video");
// Global variables.
const mp4Path = __dirname + "/downloaded/video.mp4";
const mp3Path = __dirname + "/downloaded/audio.mp3";
const pathToPublic = path.join(__dirname, "public");
let videoTitle;

// Server configuration.
const port = process.env.PORT || 3000;
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true,
	})
);
app.use(cors());
app.use(express.static(pathToPublic));

// Defining routes.
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});


app.post("/convert", async (req, res) => {
	const videoLink = req.body.data;
	console.log("Received video url from client: " + videoLink);
	try {
		if (videoLink === "") {
			throw (Error('Video link is empty'))
		}
		console.log("Fetching basic video information");
		const videoInfo = await ytdl.getBasicInfo(videoLink);
		console.log('Basic info fetched succesfully');
		videoTitle = videoInfo.videoDetails.title;
		console.log("Downloading video: " + videoInfo.videoDetails.title);
		// Use this if you want to pass stream to convertinf function.
		//const stream = await downloadVideo(videoLink);
		await downloadVideo(videoLink);
		console.log('Video downloaded succesfully');

		console.log("Converting video to audio");
		convertToMp3(mp4Path, mp3Path);
		console.log("Video converted succesfully");

		//console.log(videoInfo.videoDetails.title);
		res.send(JSON.stringify(videoTitle));
	} catch {
		console.log(error);
		res.redirect("/convert/failure");
	}

});

app.get("/download", (req, res) => {
	res.download(mp3Path, videoTitle);
}
);

//Start your server on a specified port
app.listen(port, () => {
	console.log(`Server is runing on port ${port}`);
});

function downloadVideo(link) {
	return new Promise((resolve, reject) => {
		const stream = ytdl(link);
		// Version for converting using file.
		stream.pipe(fs.createWriteStream(mp4Path))
			.on('finish', () => {
				resolve(stream);
			});
		// Version for converting using stream.
		//stream.pipe(fs.createWriteStream(mp4Path));
		//resolve(stream);
	});
}

function convertToMp3(source, targetFilePath) {
	proc = new ffmpeg({ source: source });
	proc.saveToFile(targetFilePath, (stdout, stderr) => {
		return stderr
			? console.log(stderr)
			: console.log("Video is being converted to mp3.");
	});
}
