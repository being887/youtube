const express = require('express');
const { spawn } = require('child_process');
const ytdl = require('ytdl-core');
const fs = require('fs');
const port =process.env.PORT || 3000

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine","hbs")

app.get("/",(req,res)=>{
  res.render("index")
})
app.get('/health', (req, res) => {
  res.status(200).send('200 OK');
});

app.post('/download', async (req, res) => {
  const videoUrl = req.body.url;
  const format = req.body.format;
  const quality = req.body.quality;
  const filter = (format && quality) ? `format=${format}+${quality}` : 'audioandvideo';

  try {
    const info = await ytdl.getInfo(videoUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  
    res.setHeader('Content-disposition',`attachment; filename="${videoTitle}.mp4"`);
    const youtubeDl = ytdl(videoUrl, { filter });
    youtubeDl.pipe(res);
  
  } catch (error) {
    console.log(error);
    res.status(500).send('Error downloading video');
  }
});






app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
