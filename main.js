var trip = require('tripcode');
var LineByLineReader = require('line-by-line');
var jsonfile = require('jsonfile')
const fs = require('fs');

//file containing target string
var target = 'target.json';
var match  = false;

//read target json
var targetFileObj = jsonfile.readFileSync(target);
//target string
var targetString  = targetFileObj.target;

function isMatch(line, target){
	if (trip(line) == target){
        console.log('Trip matched this password!\n' + line);
        var output  = {'target':target, 'passMatch': line}
        var content = JSON.stringify(output);
        writeJson(content);
        return;
	}else{
		return false;
	}
}

function writeJson(content){
	fs.writeFile("target.json", content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
}

function seekMatch(target){
	//line by line object
    var thisLineByLineReader = new LineByLineReader('passDictionary.txt');
    var thisLine             = '';

	//read through lines without buffering to memory
	thisLineByLineReader.on('line', function (line) {
		if (line.length >= 8){
			//for strings with length of 8, check trip for match
            isMatch(line, target);
		}else if (line.length < 8){
			//for strings of less than length of 8, try adding numbers until you've run out of strings
			if (!isMatch(line, target)){
				var counter  = 0;
			    var distance = 8 - line.length;
				    while (counter.toString().length <= distance) {
				    	var counter = counter + 1;
				    	var newLine = line + counter.toString();
				    	isMatch(newLine, target);
				    }
				}
		}
    });
}

seekMatch(targetString);