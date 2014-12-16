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


function ArrayCollection() {
    var myArray = new Array;	
	
    return {
        empty: function () {
            myArray = new Array;
        },
        add: function (myElement) {
            myArray.push(myElement);
        },
        getAll: function() {
            return myArray;
        },
        remove: function(item) {
            for(var i = 0; i < myArray.length; i++) {
                if(item == myArray[i]) {
                    return myArray.splice(i, 1);
                }
            }
            return null;
        },
        removeID: function(id) {
            for(var i = 0; i < myArray.length; i++) {
                if(id == myArray[i].id) {
                    return myArray.splice(i, 1);
                }
            }
            return null;
        },
        getCount: function() {
            return myArray.length;
        }
    }
}

	
	
var movieCollection = new ArrayCollection();
var sortAescending = false;

movieCollection.reverseOrder = function() {
	sortAescending = (sortAescending == true) ? false : true;
	console.debug(sortAescending);
	movieCollection.getAll().reverse();
}
movieCollection.exists = function(movieID) {
    var movies = this.getAll();
    for(var i = 0; i < movies.length; i++) {
		if (movies[i].id === movieID) return true;
    }
    return false;
}
movieCollection.search = function(query) {
    var movies = this.getAll();
    var subset = [];

    for(var i = 0; i < movies.length; i++) {
		if (movies[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) subset.push(movies[i]);
    }

    return subset;
}

movieCollection.CompareTitles = function(a, b){
	if ( sortAescending ) { var t=a; a=b; b=t; } // swap the params

	var aName = a.title.toLowerCase();
	var bName = b.title.toLowerCase(); 
	return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}
movieCollection.CompareRelease = function(a, b){
	if ( sortAescending ) { var t=a; a=b; b=t; } // swap the params
	
	var aName = a.released.toLowerCase();
	var bName = b.released.toLowerCase(); 
	return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}
movieCollection.CompareRating = function(a, b){
	if ( sortAescending ) { var t=a; a=b; b=t; } // swap the params
	
	if ( a.rating > b.rating ) return -1;  // a goes nearer to the top
    if ( a.rating < b.rating ) return 1;   // a goes nearer to the bottom
    return 0;                  // both are the same
}

movieCollection.SortByTitle = function(){
	this.getAll().sort(movieCollection.CompareTitles);
}

movieCollection.SortByRelease = function(){
	this.getAll().sort(movieCollection.CompareRelease);
}

movieCollection.SortByRating = function(){
	this.getAll().sort(movieCollection.CompareRating);
}
        

		
		
function movie() {
    this.id; 
    this.title;
    this.year;
    this.rating;
    this.genre;
    this.plot;
    this.runtime;
    this.language;
    this.actors;
    this.director;
    this.released;
    this.rawInput;
    this.extension;
    this.extension;
}
