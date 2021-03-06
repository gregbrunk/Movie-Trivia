//Set Global Variables
var shuffledMovies = movies;
var buttonOne = $('#movie1');
var buttonTwo = $('#movie2');
var buttonThree = $('#movie3');
var buttonFour = $('#movie4');
var thisMovie;
var thisRound;
var roundTimer;
var roundScorer;
var userTimer = 30;
var userScore = 300;

var totalScore = 0;
var round=1;
var successful=0;

//Generate Movie Functions
function shuffleMovies(){
	for (var i = shuffledMovies.length-1; i > 0; --i) {
		var j = Math.floor(Math.random() * (i+1));
		var temp = shuffledMovies[i];
		shuffledMovies[i] = shuffledMovies[j];
		shuffledMovies[j] = temp;
	}	
}
shuffleMovies(shuffledMovies);

function generateMovie(){
	thisMovie = shuffledMovies[0];
	shuffledMovies.shift();
}

//Start the Game!
$("#start").click(startGame);

//Start Game Function
function startGame(){
	$("#start-screen").addClass("hide");
	$("#main-content").removeClass("hide");
	generateMovie();
	//Start the Round
	thisRound = new Round(thisMovie.url, thisMovie.movieName, thisMovie.wrongNameOne, thisMovie.wrongNameTwo, thisMovie.wrongNameThree);
	thisRound.start();
	//Start the Timer
	roundTimer = new Timer(userTimer);
	roundTimer.applyTimer();
	//Start the Scoring
	roundScorer = new Score(userScore);
	roundScorer.applyScorer();
}

//Build Round Constructor
function Round(url, movieName, wrongNameOne, wrongNameTwo, wrongNameThree) {
	this.url = url;
	this.movieName = movieName;
	this.wrongNameOne = wrongNameOne;
	this.wrongNameTwo = wrongNameTwo;
	this.wrongNameThree = wrongNameThree;
	this.orderedAnswers = [];
	this.shuffledAnswers = [];
}

//Build Any Round Methods
Round.prototype = {
	//Start the Round
	start: function(){
		this.setVideo();
		this.setOrderedAnswers();
		this.randomizeAnswers(this.orderedAnswers);
		this.setButtons();
		this.addListeners();
	},
	//Append URL to iframe
	setVideo: function(){
		var video = $('#video-frame');
		video.attr('src', this.url);
	},
	//Set Normal Anaswer Array (Correct Answer First)
	setOrderedAnswers: function(){
		this.orderedAnswers = [this.movieName,this.wrongNameOne,this.wrongNameTwo,this.wrongNameThree];
	},
	//Set Randomized Answer Array
	randomizeAnswers: function(array){
		var j, x;
	    for(var i=array.length; i; i-=1) {
	        j = Math.floor(Math.random() * i);
	        x = array[i - 1];
	        array[i - 1] = array[j];
	        array[j] = x;
	    }
    	this.shuffledAnswers = array;
	},
	//Append Randomized Answer Array to Buttons
	setButtons: function(){
		buttonOne.html(this.shuffledAnswers[0]);
		buttonTwo.html(this.shuffledAnswers[1]);
		buttonThree.html(this.shuffledAnswers[2]);
		buttonFour.html(this.shuffledAnswers[3]);
	},
	//Add Listeners to My Buttons (BAD CODE!)
	addListeners: function(){
		//Listener for Scoreboard
		var correctAnswer = buttonOne;
		//Set Right Answer
		if(buttonOne.html() == this.movieName) {
			buttonOne.click(addWinner);
			correctAnswer = buttonOne;
		} else if (buttonTwo.html() == this.movieName){
			buttonTwo.click(addWinner);
			correctAnswer = buttonTwo;
		} else if (buttonThree.html() == this.movieName) {
			buttonThree.click(addWinner);
			correctAnswer = buttonThree;
		} else if (buttonFour.html() == this.movieName) {
			buttonFour.click(addWinner);
			correctAnswer = buttonFour;
		}
		//Set Wrong Answers
		if (correctAnswer == buttonOne) {
			buttonTwo.click(addLoser);
			buttonThree.click(addLoser);
			buttonFour.click(addLoser);
		} else if (correctAnswer == buttonTwo) {
			buttonOne.click(addLoser);
			buttonThree.click(addLoser);
			buttonFour.click(addLoser);
		} else if (correctAnswer == buttonThree) {
			buttonOne.click(addLoser);
			buttonTwo.click(addLoser);
			buttonFour.click(addLoser);
		} else if (correctAnswer == buttonFour) {
			buttonOne.click(addLoser);
			buttonTwo.click(addLoser);
			buttonThree.click(addLoser);
		}
		var self = this;
		buttonOne.click(function(){
			updateScoreboard(self.shuffledAnswers[0]);
			updateTotals(self.shuffledAnswers[0]);
		});
		buttonTwo.click(function(){
			updateScoreboard(self.shuffledAnswers[1]);
			updateTotals(self.shuffledAnswers[1]);
		});
		buttonThree.click(function(){
			updateScoreboard(self.shuffledAnswers[2]);
			updateTotals(self.shuffledAnswers[2]);
		});
		buttonFour.click(function(){
			updateScoreboard(self.shuffledAnswers[3]);
			updateTotals(self.shuffledAnswers[3]);
		});
	}
};


//Build Timer Constructor
function Timer(time){
	this.time = time;
	this.timerDisplay = $('.time');
	this.timeInterval = "";
	this.finalTime = "";
}

//Setup Timer Methods
Timer.prototype = {
	applyTimer: function(){
		var timer = $("<p>");
		timer.attr({class: 'big', id:'timer'});
		timer.html(":" + this.time);
		this.timerDisplay.append(timer);
		
		var self = this;
		this.timeInterval = setInterval(function(){
			self.runTimer(timer);},1000);
	},
	runTimer: function(timer) {
		if (this.time>=1) {
			this.time--;
		} else {
			window.clearInterval(this.timeInterval);
		}
		timer.html(":" + this.time);
		
		if (this.time<=5) {
			timer.addClass('red');
		}
		if (this.time===0) {
			swal({
				title: "Oops!",
				text: "Time's Up...", 
				type: "error",
				confirmButtonText: "Next Round",
				animation: "slide-from-top",
			});
			$("#your-answer").text("Nothing! Silly...");
			addLoser();
		}
	},
	stopInterval: function(){
		window.clearInterval(this.timeInterval);
		this.finalTime = this.time;
	}
};

//Build Score Constructor
function Score(score){
	this.score = score;
	this.scoreDisplay = $('.score');
	this.scoreInterval = "";
	this.finalScore = "";
}

//Setup Score Methods
Score.prototype = {
	applyScorer: function(){
		var scorer = $("<p>");
		scorer.attr({class:'big', id:'scorer'});
		scorer.html(this.score);
		this.scoreDisplay.append(scorer);
		var self = this;
		this.scoreInterval = setInterval(function(){
			self.runScore(scorer);},100);
	},
	runScore: function(scorer) {
		if (this.score>0) {
			this.score = this.score - 1;
		} else {
			window.clearInterval(this.scoreInterval);
		}
		scorer.html(this.score);
		if (this.score<=50) {
			scorer.addClass('red');
		}
	},
	stopInterval: function(){
		window.clearInterval(this.scoreInterval);
		this.finalScore = this.score;
	},
	loserScore: function(){
		//Set Score to 0
		this.score = 0;
		//Remove Score Display
		$('#scorer').remove();
		//Add New Score Display of 0
		var scorer = $("<p>");
		scorer.attr({class:'big', id:'scorer'});
		scorer.addClass('red');
		scorer.html(this.score);
		this.scoreDisplay.append(scorer);
	}
};

//Answer Completed Functions
function addWinner(){
	roundTimer.stopInterval();
	roundScorer.stopInterval();
	$("#next-round").addClass("good-round");
	$("#correct-incorrect").text("Correct!");
	nextRoundScreen();
}

function addLoser(){
	roundTimer.stopInterval();
	roundScorer.stopInterval();
	roundScorer.loserScore();
	$("#next-round").addClass("bad-round");
	$("#correct-incorrect").text("Nope!");
	nextRoundScreen();
}

function updateScoreboard(movieName){
	var rowClass = "#row"+round;
	var movie = $("<p>");
	movie.addClass("movie");
	movie.html(movieName);
	$(rowClass).append(movie);
	$("#your-answer").text(movieName);
	
	if (movieName !== thisRound.movieName) {
		movie.addClass("wrong");
	}
}

function updateTotals(movieName){
	if (movieName == thisRound.movieName) {
		successful++;
		totalScore = totalScore + roundScorer.finalScore;
		$("#successful").text(successful);
		$("#totalScore").text(totalScore);
	}
}

//Round Control Functions
function nextRoundScreen(){
	$("#trivia-screen").addClass("hide");
	$("#next-round").removeClass("hide");
	$("#video-frame").removeAttr("src");
	roundChecker();
}

$("#next-round-button").click(reset);
$("#next-round-button").click(nextRound);

function reset(){
	//Reset Classes
	$("#next-round").addClass("hide");
	$("#trivia-screen").removeClass("hide");
	$('#scorer').remove();
	$('#timer').remove();
	$("#next-round").removeClass("bad-round");
	$("#next-round").removeClass("good-round");
	//Unbind Movies from Buttons
	buttonOne.unbind();
	buttonTwo.unbind();
	buttonThree.unbind();
	buttonFour.unbind();
}

function nextRound(){
	//Update Round
	round++;
	//Change Round Number
	$("#round-number").text(round);
	//Generate New Movie
	generateMovie();
	//Start the Round
	thisRound = new Round(thisMovie.url, thisMovie.movieName, thisMovie.wrongNameOne, thisMovie.wrongNameTwo, thisMovie.wrongNameThree);
	thisRound.start();
	//Start the Timer
	roundTimer = new Timer(userTimer);
	roundTimer.applyTimer();
	//Start the Scoring
	roundScorer = new Score(300);
	roundScorer.applyScorer();
}

//Round Checker
function roundChecker(){
	if (round == 10){
		$("#next-round-button").unbind();
		$("#next-round-button").click(reload);
		$("#next-round-button").html("Play Again?");
	}
}

//User Timer Control
$("#change-timer").click(changeTimer);
function changeTimer(){
	swal({
		title: "Enter Timer Length",
		text: "Please enter a value in seconds",
		type: "input",
		showCancelButton: false,
		closeOnConfirm: false,
		animation: "slide-from-top",
		inputPlaceholder: "e.g. 15" 
		}, 
		function(inputValue){     
			if (inputValue === ""){     
				swal.showInputError("You need to write something!");     
				return false;
			} else {
			userTimer = inputValue;
			swal("Nice!", "Changing timer to: " + inputValue + " seconds", "success");
			}
			userScore = userTimer * 10;
		}
	);
	reset();
	round = 0;
	$("#video-frame").removeAttr("src");
	$("#main-content").addClass("hide");
	$("#start-screen").removeClass("hide");
}

//User Reload
$("#reload").click(reload);
function reload(){
	location.reload();
}