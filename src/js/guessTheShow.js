// The MIT License (MIT)

// Copyright (c) 2014 Paul Copplestone

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE. 

/*
Namespace usage: http://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript

//Private 
var private = true;
function privateMethod () {}

//Public 
guessTheShow.public
guessTheShow.publicMethod = function() {}
*/

(function( guessTheShow, $, undefined ) {	
	var VALID_MOVIE_EXTENSIONS = ['AVI','CAM','FLV','MPEG','MP4','MPG','MPEG-1','MPEG-2','MPEG-4','FLA','FLR','M4V','MKV','MOV','SWF','WMV'];
	var SIGNAL_FORMAT = ['480p','720p','1080p','480','720', '1080'];
	
	/**
	* @returns an array with all the parts of a show
	*/
	guessTheShow.getFullShowDetails = function (fileName) {
		var full = [];
		full.rawInput = fileName;
		
		var cleansed = this.getCleansedName(fileName);
		full.cleansed = cleansed;
		
		full.extension = this.getExtension(cleansed);
		if (full.extension != "ERROR" ) cleansed = this.removeExtension(cleansed);
		
		var hasSignalFormat = this.getSignalFormat(cleansed);
		if (hasSignalFormat !== null) { 
			full.signalFormat = hasSignalFormat[0];  // get the first match only
			cleansed = this.removeSignalFormat(cleansed,full.signalFormat)
		}
		
		full.year = this.getYear(cleansed);
		full.show = this.getShow(cleansed);
		return full;
	}
	
	guessTheShow.getCleansedName = function (fileName) {
		fileName = fileName.replace(/["]+/g, ''); // remove all quotes
		fileName = fileName.split('/').pop(); // remove path
		fileName = fileName.split('\\').pop(); // remove path
		fileName.trim();
		return fileName;
	}
	
	guessTheShow.getExtension = function (fileName) {
		var upperCaseName = fileName.toUpperCase();
		var fileExtention = upperCaseName.substr(upperCaseName.lastIndexOf('.')+1, upperCaseName.length) || "ERROR"; // The (|| "ERROR") takes care of the case where lastIndexOf() provides a -1
		return fileExtention;
	}
	
	guessTheShow.removeExtension = function (fileName) {
		return fileName.substring(0, fileName.lastIndexOf('.'));
	}
	
	guessTheShow.checkValidExtension = function (extension) {
		var isValidFileExtention = ($.inArray(extension, VALID_MOVIE_EXTENSIONS) === -1) ? false : true;
		return isValidFileExtention;
	}
	
	guessTheShow.getYear = function (fileName) {
		var regex = /"?[\(\[\s\.]+(\d{4})/;
		var year = fileName.match(regex);
		if (year === null) // no year was found 
			return "";
		else return fileName.match(regex)[1];
	}
	
	guessTheShow.getShow = function (fileName) {
		var regex = /"?(.*?)"?[\(\[\s\.]+(\d{4})/;
		var nameParts = fileName.match(regex); // get everything up to the year
		if (nameParts === null) // no year was found
			var name = fileName // make the whole file the movie name
		else
			var name = nameParts[1];
		name = name.split(".").join(" "); // substitute all periods for spaces
		name = name.replace(/[\(\)\[\]]+/g, ''); // remove all brackets
		
		return name;
	}
	
	/**
	* @returns an array of matching signal formats in the name
	*/
	guessTheShow.getSignalFormat = function (fileName) {
		var regex = new RegExp(SIGNAL_FORMAT.join("|"), "i");
		return(fileName.match(regex)); // send back the first match
	}
	
	guessTheShow.removeSignalFormat = function (fileName, signalFormat) {
		return fileName.replace(signalFormat,' ');
	}
	
    guessTheShow.getDetailsFromString = function(fileName, hasFileExtension) {
		setInput(fileName);
		if (hasFileExtension) setExtension(input);
		
		fileName = input;
		fileName = fileName.split(".").join(" "); // substitute all periods for spaces
		
		// use Regex to get the name and the year from the file name 
		var regex = /"?(.*?)"?[\(\[\s\.]+(\d{4})/;
		var nameParts = fileName.match(regex);
		console.debug(this);
		if (nameParts == null) {
			// the title doesn't have a year, 
			// return the whole name with an empty year
			fileName = fileName.substr(0, upperCaseName.lastIndexOf(extension)); // remove the extension
			return new Array('', fileName, '');
		}
		else
			return nameParts;
	}
	
}( window.guessTheShow = window.guessTheShow || {}, jQuery ));