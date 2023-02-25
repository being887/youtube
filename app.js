const express = require('express');
const ytdl = require('ytdl-core');


const fs = require('fs');
const { format } = require('path');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/health", (req, res) => {
  res.status(200).send("200 OK");
});

app.post('/video', async (req, res) => {
  const videoUrl = req.body.url;
  const info = await ytdl.getBasicInfo(videoUrl);

  const format1 = info.formats.filter((format) => (format.itag <= 150 && format.itag >= 100));
  
  const videoData = format1.map((format) => {
    return {
      thumbnail: info.videoDetails.thumbnails[0].url,
      title: info.videoDetails.title,
      qualityLabel: format.qualityLabel,
      url: videoUrl
    }
  });

  res.render("index", { videoData });
});

app.post('/download1', async (req, res) => {
  const videoUrl = req.body.url;
  const quality = req.body.quality;
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  res.setHeader('Content-disposition', `attachment; filename="${videoTitle}".mp4`);
  const options={
    filter:format=>format.qualityLabel===quality,
    
  }
 
  const video=ytdl(videoUrl,options);



     video.pipe(res);
});
app.post('/download2',async(req,res)=>{
  const quality = req.body.quality;
  const videoUrl=req.body.url;
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  res.setHeader('Content-disposition', `attachment; filename="${videoTitle}".mp4`);
  const options1={
    filter:'videoandaudio'
  }
  const video1=ytdl(videoUrl,options1);
  video1.pipe(res);
})

app.post('/download3',async(req,res)=>{
  
  const videoUrl=req.body.url;
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  res.setHeader('Content-disposition', `attachment; filename="${videoTitle}".mp3`);
  const options1={
    filter:'audioonly'
  }
  const video1=ytdl(videoUrl,options1);
  video1.pipe(res);
})
app.post('/download4',async(req,res)=>{
  
  const videoUrl=req.body.url;
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  const keywords=info.videoDetails.keywords;
   console.log(keywords);
   res.render('index', { keywords: keywords });

})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
