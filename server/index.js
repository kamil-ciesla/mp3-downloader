const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

const ytdl = require("ytdl-core");
const fs = require("fs");

// We are using our packages here
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res) => {
	res.send("Welcome to your server")
})

//Route that handles login logic
app.post('/convert', (req, res) => {
	console.log(req.body.link)
	ytdl(req.body.link).pipe(
		fs.createWriteStream("video.mp4")
	);
	res.send('Video is being downloaded on server! ');
})


//Start your server on a specified port
app.listen(port, () => {
	console.log(`Server is runing on port ${port}`)
})



