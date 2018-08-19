var trip = require('tripcode');
var LineByLineReader = require('line-by-line');
var jsonfile = require('jsonfile')
const fs = require('fs');

//file containing target string
var target     = 'target.json';
var match      = false;
var triedArray = [];

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
    return;
}); 
}

function isAllNumbers(str){
	//test whether or not a string only contains numbers
	return /^\d+$/.test(str);
}

function seekMatch(file, target){
	//line by line object
    var thisLineByLineReader = new LineByLineReader(file);
    var thisLine             = '';
    var triesCounter         = 0;
    //have we checked integers under 8 length already?
    var checkedNumbers       = false;

	//read through lines without buffering to memory
	thisLineByLineReader.on('line', function (line) {
		if (line.length >= 8 && (line.length > 4)){
			//for strings with length of 8, check trip for match
			//print test data every ~100 guesses
			if (triesCounter % 100 == 0) console.log('100 attempts: currently trying to match pass: ' + line);
            isMatch(line, target);
            //update tries counter
			triesCounter += 1;
			//update 'tried' array
			triedArray[line] = 1;
		}else if (line.length < 8 && (triedArray.line != 1) && !(line in triedArray) && (line.length > 4)){
			//for strings of less than length of 8, try adding numbers until you've run out of strings
			if (!isMatch(line, target)){
				var counter  = 0;
			    var distance = 8 - line.length;
				    while (counter.toString().length <= distance) {
				    	if (checkedNumbers){
				    		triesCounter +=1;
				    		break;
				    	}
				    	var counter = counter + 1;
				    	var newLine = line + counter.toString();
				    	//if we have checked all numbers under 8 length already, move to next line
				    	if (isAllNumbers(line) && newLine.length == 8){
				    		checkedNumbers = true;
				    	} 
				    	if (triesCounter % 100 == 0) console.log('100 attempts: currently trying to match pass: ' + line);
				    	isMatch(newLine, target);
				    	//update tries counter
				    	triesCounter += 1;
				    	triedArray[line] = 1;
				    }
				}
		}
    });
}

//iterate through dictionaries directory and 
//run seekmatch
fs.readdirSync('dicts').forEach(file => {
  seekMatch('./dicts/' + file, targetString);
})