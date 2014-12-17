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


$(document).ready(function() {
	// GLOBALS
	var TOTAL_SELECTED = 0;
	var TOTAL_RETRIEVED = 0;
	var ERROR_LIST = [];
	
    // TEMPLATES
    var movieTemplate = $("#movie-summary-template").html();
    var movieTemplateC = Handlebars.compile(movieTemplate);

	
	function updateProgress(){
		TOTAL_RETRIEVED++;
		var percentage = Number((TOTAL_RETRIEVED / TOTAL_SELECTED) * 100).toFixed(0);
		$('#progress-bar').css('width', percentage+'%');
		$('#progress-bar').html(percentage+'%');
		if (percentage >= 100) { // reset the progress bar
			movieCollection.SortByTitle();
			saveMovieCollectionToLocalStorage();
			$("#progress-movie-scan").hide();
			if (ERROR_LIST.length > 0) displayErrorDialog(); 
			showHelpIfEmpty();
			updateMovieCount();
		}
	}

    function getOMDbObject(movie) {
        var uri = "http://www.omdbapi.com/?t=" + movie.title + "&y=" + movie.year + "&plot=short&r=json";

        $.getJSON(uri, function(OMDbResponse) {
			if (!movieCollection.exists(OMDbResponse.imdbID)) { // check if we already have the movie
				if (OMDbResponse.Response == "False") {
					var errorArray = [movie.rawInput, OMDbResponse.Error];
					ERROR_LIST.push(errorArray);
				}
				else if (OMDbResponse.Type == "episode"){
					var err = "We don't yet support TV shows. This appears to be a TV episode: ";
					err = err + '<a href="http://imdb.com/title/'+OMDbResponse.imdbID+'" target="_blank">'+OMDbResponse.imdbID+'</a>';
					var errorArray = [movie.rawInput, err];
					ERROR_LIST.push(errorArray);
				}
				else {
					movie.id = OMDbResponse.imdbID;
					movie.title = OMDbResponse.Title;
					movie.rating = OMDbResponse.imdbRating;
					movie.genre = OMDbResponse.Genre;
					movie.plot = OMDbResponse.Plot;
					movie.runtime = OMDbResponse.Runtime;
					movie.language = OMDbResponse.Language;
					movie.actors = OMDbResponse.Actors;
					movie.director = OMDbResponse.Director;
					movie.released = moment(OMDbResponse.Released).format('YYYY-MM-DD');
					
					addMovieToList(movie);
					movieCollection.add(movie);
				}
			}
        }).done(function() {
			updateProgress();
		});
    }
	
	function displayAllMovies() {
		$("#all-movies").empty();
		movieCollection.getAll().forEach(function(entry) {
			addMovieToList(entry);
		});
	}

    function addMovieToList(movieObj) {
        $("#all-movies").append(movieTemplateC({
            title: movieObj.title,
            year: movieObj.year,
            rating: movieObj.rating,
            id: movieObj.id,
            genre: movieObj.genre,
            plot: movieObj.plot,
            runtime: movieObj.runtime,
            language: movieObj.language,
            actors: movieObj.actors,
            director: movieObj.director,
            released: movieObj.released,
            raw: movieObj.rawInput
        }));
    }

    function saveMovieCollectionToLocalStorage() {
		localStorage.setItem("movieCollection", JSON.stringify(movieCollection.getAll()));
    }
	
	function emptyMovieCollection() {
		movieCollection.empty();
		localStorage.removeItem("movieCollection");
		$("#all-movies").empty();
		TOTAL_MOVIES = 0;
		TOTAL_SELECTED = 0;
		ERROR_LIST = [];
		showHelpIfEmpty();
		updateMovieCount();
	}
	
	function startMovieLoad(numMoviesToLoad) {
		TOTAL_SELECTED = numMoviesToLoad;
		TOTAL_RETRIEVED = 0;
		
		// show the progress bar and hide the information panels
		$('#progress-bar').css('width', 1+'%');
		$('#progress-bar').html(1+'%');
		$("#progress-movie-scan").fadeIn(); 
		$('#section-add-list').hide();
		$('#panel-getting-started').hide();
		
		 // empty the error list
		$("#alert-errors").hide();
		ERROR_LIST = [];
		$('#error-list').empty();
	}
	
	function getMoviesInStorage() {
		
		if ("movieCollection"  in localStorage && localStorage.getItem("movieCollection") !== null) {
			var movies = JSON.parse(localStorage.getItem("movieCollection"));
			
			$.each(movies, function(index, value) {
				var movieObj = new movie();
				movieObj.id = value.id;
				movieObj.title = value.title;
				movieObj.year = value.year;
				movieObj.rating = value.rating;
				movieObj.genre = value.genre;
				movieObj.plot = value.plot;
				movieObj.runtime = value.runtime;
				movieObj.language = value.language;
				movieObj.actors = value.actors;
				movieObj.director = value.director;
				movieObj.released = value.released;
				movieObj.rawInput = value.rawInput;
				movieCollection.add(movieObj);
			});
		}
		
		var numMovies = movieCollection.getAll().length;
		if (numMovies > 0) {
			startMovieLoad(numMovies);
			// Add all movies to the webpage
			for (var i = 0; i < numMovies; i++) {
				addMovieToList(movieCollection.getAll()[i]);
				updateProgress();
			}
		} else showHelpIfEmpty();
	}	
	
	
	
	function displayErrorDialog() {
		for (var i = 0; i < ERROR_LIST.length; i++) {
			$('#error-list').append("<p><strong>" + ERROR_LIST[i][0] + "</strong><br />" + ERROR_LIST[i][1] + "</p>" );
		}
		$('#alert-errors').fadeIn();
	}
	
	
	function getDetailsFromString(fileName, hasFileExtension) {
		try {
			var rawInput = fileName;
			var cleansedName = guessTheShow.getCleansedName(rawInput);
			
			var movieObj = new movie();
			if (hasFileExtension) {
				movieObj.extension = guessTheShow.getExtension(cleansedName);
				if (movieObj.extension == "ERROR" || !guessTheShow.checkValidExtension(movieObj.extension)) 
					throw "Not a valid movie extension. Please ensure the file is a movie file.";
				else {// now that we have the extension, strip it and the '.' from the name
					cleansedName = cleansedName.substring(0, cleansedName.lastIndexOf('.'));
				}
			}
			var hasSignalFormat = guessTheShow.getSignalFormat(cleansedName);
			if (hasSignalFormat !== null) { 
				var signalFormat = hasSignalFormat[0];  // get the first match only
				cleansedName = guessTheShow.removeSignalFormat(cleansedName, signalFormat);
				console.debug(rawInput);
				console.debug(cleansedName);
			}
			movieObj.rawInput = rawInput;
			movieObj.year = guessTheShow.getYear(cleansedName);
			movieObj.title = guessTheShow.getShow(cleansedName);
			
			
			getOMDbObject(movieObj);
		
		} catch (error) {
			var errorArray = [fileName, error];
			ERROR_LIST.push(errorArray);
			updateProgress();
		}
	}
	
	function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
		startMovieLoad(files.length);
		
        for (var i = 0, f; f = files[i]; i++) {
            getDetailsFromString(decodeURIComponent(escape(f.name)), true);
        }
		$('#search-form').trigger("reset"); // reset the search form
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
	
	
    $('#btn-load-list').click(function(e){ 
		e.preventDefault(); e.stopPropagation ();
		
		var movieList = $('#txt-load-list').val().split('\n');
		var hasFileExtension = $("#chk-ignore-extension").is(':checked');
		startMovieLoad(movieList.length);
		$('#txt-load-list').val('');
		
		$.each(movieList, function(){
		   if (this.length > 0) getDetailsFromString(this, hasFileExtension);
			else updateProgress();
		});
		$('#search-form').trigger("reset"); // reset the search form
	});
	
	function updateMovieCount() {
		if (movieCollection.getCount() === 0) {
			$('#div-movie-count').hide();
		}
		else {
			$('#div-movie-count').show();
			var visible = $(".movie-container:visible").length;
			$('#badge-count').text(movieCollection.getCount());
			$('#badge-count-showing').text(visible);
		}
	}
	
	function filterOrderBy() { 
		var filter = $('#search-order-by').val();
		if ( filter == 'title' ) { movieCollection.SortByTitle(); }
		else if ( filter == 'rating' ) { movieCollection.SortByRating(); }
		else if ( filter == 'release' ) { movieCollection.SortByRelease(); }
	}
	
	function filterRating() {
		if ( $('#search-rating').val() != 'all') {
			var min = parseFloat($('#search-rating').val());
			$('.movie-container').each( function( index, element ){
				if ( parseFloat($(this).data("rating")) < min || $(this).data("rating") == "N/A")
					$(this).remove();
			});
		}
	}
		
	function applyFilters(){
		$('.movie-container').show(); // make sure all are showing first
		filterOrderBy();
		displayAllMovies();
		filterRating();
		$('#q').keyup();
		updateMovieCount();
	}
	
	/**
	 * Shows the 'Getting Started' panel if nothing else is being displayed
	 */
	function showHelpIfEmpty() {
		if (!$('#section-add-list').is(":visible") && movieCollection.getAll().length === 0)
			$('#panel-getting-started').show();
		else 
			$('#panel-getting-started').hide();
	}
	
	function checkOrderBy (){
		if ( $('#order-chevron').hasClass("glyphicon-chevron-up")) return "asc";
		else return "desc";
	}
	$('#btn-order-by').click(function(e){
		movieCollection.reverseOrder();
		if ( checkOrderBy() == "asc" ) // change to descending order
			$('#order-chevron').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
		else // change to ascending order
			$('#order-chevron').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
				
		applyFilters();
    });
	$('#search-order-by').on('change', function() {
		applyFilters();
	});
	$('#search-rating').on('change', function() {
		applyFilters();
	});
	
    
    $('.section-add-list-toggle').click(function(e){ 
		$('#section-add-list').toggle();
		$('#panel-getting-started').hide();
		showHelpIfEmpty();
	});
    $('.panel-getting-started-toggle').click(function(e){ 
		$('#section-add-list').hide();
		$('#panel-getting-started').toggle();
	});
	
	
	
    $('#btn-empty').click(function(e){ $('#panel-delete').fadeIn();	});
	$('#btn-delete-cancel').click(function(e){ $('#panel-delete').hide(); });
	$('#btn-delete-confirm').click(function(e){ 
		emptyMovieCollection(); 
		$('#panel-delete').hide();
	});
	
	
	// Initialize the text search box 
	$('#q').val('').hideseek({
		highlight: true
	});
	$('#q').val('').on("_after", function() {
		updateMovieCount();
	});
	
	// Handler for removing individual movies
	$('#all-movies').on( 'click', '.btn-remove-movie', function () {
		if (confirm("Are you sure you would like to remove this movie from your MyMDb collection? This will not delete the movie from your computer")) {
			var id = $(this).data('id');
			movieCollection.removeID(id);
			$('#'+id).remove();
			saveMovieCollectionToLocalStorage();
			updateMovieCount();
		}
    });
	
	// Initialize all tooltips
	$('[data-toggle="tooltip"]').tooltip();
	
	getMoviesInStorage();
	$('#search-form').trigger("reset"); // reset the form
});


