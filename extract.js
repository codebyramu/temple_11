const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const videoPath = path.join(__dirname, 'Video.mp4');
const framesDir = path.join(__dirname, 'public', 'frames');

// Clean out old frames
if (fs.existsSync(framesDir)) {
  const oldFiles = fs.readdirSync(framesDir);
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(framesDir, f));
  }
  console.log(`Cleaned ${oldFiles.length} old frames`);
} else {
  fs.mkdirSync(framesDir, { recursive: true });
}

ffmpeg.ffprobe(videoPath, (err, metadata) => {
  if (err) {
    console.error('Error probing video:', err);
    process.exit(1);
  }

  const duration = metadata.format.duration;
  const videoStream = metadata.streams.find(s => s.codec_type === 'video');
  const width = videoStream ? videoStream.width : '?';
  const height = videoStream ? videoStream.height : '?';
  console.log(`Video: ${width}x${height}, duration: ${duration}s`);

  const targetFrames = 250;
  const fps = targetFrames / duration;

  console.log(`Extracting at ${fps.toFixed(2)} fps => ~${targetFrames} frames`);
  console.log('Output: WebP quality 95, full resolution, no downscaling');

  ffmpeg(videoPath)
    .outputOptions([
      `-vf fps=${fps}`,
      '-vcodec libwebp',
      '-lossless 0',
      '-compression_level 0',   // fastest, no extra compression
      '-q:v 95',                // quality 95 (near-lossless)
      '-preset default',
    ])
    .output(path.join(framesDir, 'frame_%04d.webp'))
    .on('progress', (progress) => {
      if (progress.percent) {
        process.stdout.write(`\rProgress: ${progress.percent.toFixed(1)}%`);
      }
    })
    .on('end', () => {
      console.log('\nFrame extraction finished');
      // Report size
      const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp'));
      let totalSize = 0;
      for (const f of files) {
        totalSize += fs.statSync(path.join(framesDir, f)).size;
      }
      console.log(`${files.length} frames, total size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
      const avgSize = totalSize / files.length / 1024;
      console.log(`Average frame size: ${avgSize.toFixed(1)} KB`);

      // Check if too large (> 500 MB) — if so, user asked to switch to PNG
      if (totalSize > 500 * 1024 * 1024) {
        console.log('\n⚠ Total size exceeds 500MB — re-extracting as PNG for zero artifacts...');
        // Clean webp
        for (const f of files) {
          fs.unlinkSync(path.join(framesDir, f));
        }
        ffmpeg(videoPath)
          .outputOptions([
            `-vf fps=${fps}`,
            '-vcodec png',
          ])
          .output(path.join(framesDir, 'frame_%04d.png'))
          .on('end', () => {
            const pngFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.png'));
            let pngSize = 0;
            for (const f of pngFiles) {
              pngSize += fs.statSync(path.join(framesDir, f)).size;
            }
            console.log(`PNG extraction done: ${pngFiles.length} frames, ${(pngSize / 1024 / 1024).toFixed(1)} MB`);
          })
          .on('error', (err) => console.error('PNG extraction error:', err))
          .run();
      }
    })
    .on('error', (err) => {
      console.error('Error extracting frames:', err);
    })
    .run();
});
