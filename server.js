//require general use functions
require('./config/config');
//end general use functions

const express = require('express')
const fs = require('fs')
const path = require('path')
var app = express()

const port = process.env.PORT;


app.get('/video', function(req, res) {
  const path = 'assets/animatic05larger.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

// Binds the root directory to display html page from public dir
app.use('/', express.static(path.join(__dirname, 'public')))
//app.use('/', express.static('public'))

app.listen(port, () => {
  console.log(`API running on port: ${port}`);
});

module.exports = {app};