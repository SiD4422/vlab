const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

console.log('Starting video trim...');

ffmpeg('public/bg-video.mp4')
  .setStartTime(2)
  .output('public/bg-video-trimmed.mp4')
  .on('end', function(err) {
    if(!err) {
      console.log('Conversion Done');
    }
  })
  .on('error', function(err){
    console.log('error: ', err);
  }).run();
