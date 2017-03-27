#!/usr/bin/env node

var os = require('os');
var path = require('path');
var clc = require('cli-color');
var phantomjs = require('phantomjs2').path;
var spawn = require('child_process').spawn;
var renderer = path.join(__dirname, 'renderer.js');
var argv = require('yargs')
    .usage('Usage: $0 --screenshots=<sketchFolder> [options]')
    .example('$0 --screenshots=<sketchFolder>', 'Create documentation assets for the p5 sketch in <sketchFolder>')
    .alias('s', 'screenshots')
    .nargs('s')
    .describe('s', 'Specifies the sketch folder to compile into docs.')
    .alias('g', 'gif')
    .nargs('g')
    .describe('g', 'Create an animated gif of the specified sketch.')
    .alias('v', 'video')
    .nargs('v')
    .describe('v', 'Output an mp4 video of the specified sketch.')
    .alias('p', 'preview')
    .nargs('p')
    .describe('p', 'Shows an ascii preview of the sketch in the terminal.')
    // .demandOption(['s'])
    .help('h')
    .alias('h', 'help')
    .argv;

var currentFolder = process.cwd();
var fileNameArray = [];

var operations = {
  screenshots: createScreenshots,
  s: createScreenshots,
  video: createVideo,
  v: createVideo,
  gif: createGif,
  g: createGif,
  preview: showPreview,
  p: showPreview,
  help: showHelp,
  h: showHelp
};

function main (args){

  for (var n in args){
    if (operations.hasOwnProperty(n)){
      if (args[n] !== undefined && args[n] !== false) {
        operations[n]();
      }
    }
  }
}

function reportErrors(args){

  var syntaxError = false;
  var mistakes = [];

  if (args._.length > 0){
    syntaxError = true;
    for (var i=0; i<args._.length; i++){
      mistakes.push(args._[i]);
    }
  }

  if (syntaxError === true){
    console.log("-------------------------------------------------------------------");
    console.log("|" + clc.red(' ☝️  doCode Errors                                               ') + " |");
    console.log("-------------------------------------------------------------------");
    console.log("|                                                                 |");
    console.log("|   The following arguments do not match doCode's command list:   |");
    console.log("|                                                                 |");
    for (var n=0; n<mistakes.length; n++){
      console.log("|    • " + mistakes[n] + (" ".repeat(59-mistakes[n].length)) + "|");
    }
    console.log("|                                                                 |");
    console.log("-------------------------------------------------------------------");

  }
}

function createScreenshots(operations){
  var target;

  if (argv.screenshots){
    if (argv.screenshots !== 'boolean'){
      target = currentFolder + '/docode_screenshots/sketch.png';
    } else {
      argv.screenshots = argv.screenshots.replace('~', os.homedir());
      target = argv.screenshots + '/docode_screenshots/sketch.png';
    }
  } else {
    if (argv.s !== 'boolean'){
      target = currentFolder + '/docode_screenshots/sketch.png';
    } else {
      argv.s = argv.s.replace('~', os.homedir());
      target = argv.screenshots + '/docode_screenshots/sketch.png';
    }
  }

  renderWebpage('file:///' + currentFolder + '/index.html', target, function (err) {
    if (err){
      throw err;
    }

    // console.log('Success!');
    var msg = " 🖼  👍  Screenshots were created successfully";
    console.log(" ");
    console.log("-------------------------------------------------------------------");
    console.log("|" + clc.cyanBright(msg) + (" ".repeat(66-msg.length)) + " |");
    console.log("-------------------------------------------------------------------");
    console.log(" ");
  });
}


function createVideo(operations){
  var msg = " 📹 😔  Video creation is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function createGif(operations){
  var msg = " 🌅 😔  GIF creation is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function showPreview(operations){
  var msg = " ☠️ 😔  Preview is not supported yet";
  console.log(" ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log(" ");
}

function showHelp(operations){
  var msg = " 💡 😔  Preview is not supported yet";
  console.log("                                                                   ");
  console.log("-------------------------------------------------------------------");
  console.log("|" + clc.cyan(msg) + (" ".repeat(66-msg.length)) + " |");
  console.log("-------------------------------------------------------------------");
  console.log("                                                                   ");
}

function renderWebpage (source, target, cb) {
  var args = [renderer, source, target];
  var child = spawn(phantomjs, args, { stdio: 'ignore' });

  // Very annoying but the precision on file modification time seems to preclude that from being used to sort our file order
  // this is not a smart/clever way to workaround but .. it works.
  for(var i = 0; i < 30; i++){
    fileNameArray.push("sketch" + i + ".png");
  }

  child.on('error', cb);
    child.on('exit', function (code) {
      if (code !== 0) {
        return cb(new Error('Bad exit code: ' + code));
      }
      cb(null);
    });
}


main(argv);
reportErrors(argv);
