// This is the docode module, it provides a simple api for creating documentation of a p5 sketch
var docode = {
  renderScreenshots: function(numOfImgs, source, target, interval) {
    var path = require('path');
    var renderer = path.join(__dirname, 'renderer.js');
    var spawnSync = require('child_process').spawnSync;
    var args = [renderer, source, target, numOfImgs, interval];
    var phantomjs = require('phantomjs2').path;

    spawnSync(phantomjs, args, {stdio: 'ignore'});
  },

  renderGif: function(name, source, target, interval) {
    var execSync = require('child_process').execSync;
    var cmd = "convert -delay " + interval + " -loop 0 " + source + " " + target;
    execSync(cmd, { stdio: 'ignore' });
  },

  renderVideo: function(name, source, target, interval) {
    var execSync = require('child_process').execSync;
    var cmd = "ffmpeg -framerate 24 -pattern_type sequence -i 'docode/_temp/sketch%02d.png' -f mp4 -c:v libx264 -pix_fmt yuv420p docode/video/" + target + ".mp4";
    execSync(cmd, { stdio: 'ignore' });
  }
};

exports.docode = docode;
