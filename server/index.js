const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("ytdl-core");
const fileUpload = require('express-fileupload');
const fs = require("fs");

const port = 3000
const mp4Path = './downloaded/video.mp4';
const mp3Path = './downloaded/audio.mp3';
// We are using our packages here
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/tmp/"
}))

//You can use this to check if your server is working
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

function youtubeDownload(req) {
	return new Promise((resolve, reject) => {
		resolve(ytdl(req.body.data).pipe(
			fs.createWriteStream("./downloaded/video.mp4")
		))
	})
}

app.post('/convert', async (req, res) => {
	await youtubeDownload(req);

	proc = new ffmpeg({ source: mp4Path });
	proc.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
	proc.saveToFile(mp3Path, (stdout, stderr) => {
		return stderr ? console.log(stderr) : console.log('Video is being converted to mp3.');
	}
	)
	res.send(JSON.stringify({ x: "foo" }));
})

function convertToMp3() {
	proc = new ffmpeg({ source: mp4Path });
	proc.setFfmpegPath('//');
	proc.saveToFile(mp3Path, (stdout, stderr) => {
		return stderr ? console.log(stderr) : console.log('Video is being converted to mp3.');
	}
	)
}

app.get('/download', (req, res) => res.download('./downloaded/video.mp4'))
//Start your server on a specified port
app.listen(port, () => {
	console.log(`Server is runing on port ${port}`)
})



