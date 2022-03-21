const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const downloader = require('./api/downloader');

const port = process.env.PORT || 3000

app.use('/api/downloader', downloader);

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(cors())

//Start your server on a specified port
app.listen(port, () => {
	console.log(`Server is runing on port ${port}`)
})



