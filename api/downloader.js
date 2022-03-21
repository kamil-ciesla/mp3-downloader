const ffmpeg = require('fluent-ffmpeg');
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require('path');
const express = require('express');
const router = express.Router();

const mp4Path = './downloaded/video.mp4';
const mp3Path = './downloaded/audio.mp3';

const pathToPublic = path.join(__dirname, '..', 'public');
router.use(express.static(pathToPublic));

router.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'index.html');
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
    proc.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
    proc.saveToFile(mp3Path, (stdout, stderr) => {
        return stderr ? console.log(stderr) : console.log('Video is being converted to mp3.');
    }
    )
}
router.post('/convert', async (req, res) => {
    const link = req.body.data;
    const stream = await downloadVideo(link);
    convertToMp3(stream);
})


router.get('/download', (req, res) => res.download('./downloaded/video.mp4'))

module.exports = router;