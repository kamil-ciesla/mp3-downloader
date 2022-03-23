const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require('path');

const mp4Path = './downloaded/video.mp4';
const mp3Path = './downloaded/audio.mp3';

const port = process.env.PORT || 3000

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cors())


//const pathToPublic = path.join(__dirname, '..', 'public');
const pathToPublic = path.join(__dirname, 'public');

app.use(express.static(pathToPublic));

app.get('/', (req, res) => {
	//const indexPath = path.join(__dirname, '..', 'index.html');
	const indexPath = path.join(__dirname, 'index.html');

	console.log(indexPath)
	res.sendFile(indexPath);
})

function downloadVideo(link) {
	return new Promise((resolve, reject) => {
		const stream = ytdl(link);
		// Version for converting using file.
		//stream.pipe(fs.createWriteStream(mp4Path)).on('finish', () => { resolve(stream); });
		// Version for converting using stream.
		stream.pipe(fs.createWriteStream(mp4Path));
		resolve(stream);

	})
}

function convertToMp3(stream) {
	proc = new ffmpeg({ source: stream });
	//proc = new ffmpeg({ source: stream });

	proc.saveToFile(mp3Path, (stdout, stderr) => {
		return stderr ? console.log(stderr) : console.log('Video is being converted to mp3.');
	}
	)
}


app.post('/convert', async (req, res) => {
	const link = req.body.data;
	const videoInfo = await ytdl.getBasicInfo(link);
	const stream = await downloadVideo(link);
	convertToMp3(stream);
	console.log(videoInfo.videoDetails.title);
	res.send(JSON.stringify(videoInfo.videoDetails.title));

})


app.get('/download', (req, res) => res.download(__dirname + '/downloaded/video.mp4'))

//Start your server on a specified port
app.listen(port, () => {
	console.log(`Server is runing on port ${port}`)
})



