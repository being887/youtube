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
  res.status(200).send('Server is healthy');
});

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;
  console.log(videoUrl);

  const youtubeDl = ytdl(videoUrl);
  youtubeDl.on('progress', (chunkLength, downloaded, total) => {
    console.log(`Downloaded ${downloaded} bytes of ${total}`);
  });

  youtubeDl.on('end', () => {
    console.log('Download finished');
    res.download('video.mp4');
  });

  youtubeDl.pipe(fs.createWriteStream('video.mp4'));
  
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
