//Set Test Object
var videoOne = {
	url: "http://www.youtube.com/embed/7UpRNOkb4hw?modestbranding=1&autoplay=1&controls=0&fs=0&rel=0&showinfo=0&disablekb=1",
	movieName: "Blades of Glory",
	wrongNameOne: "Braids of Glory",
	wrongNameTwo: "Anchorman",
	wrongNameThree: "Poopy The Pirate King",
};

//Set Global Variables
var buttonOne = $('#movie1');
var buttonTwo = $('#movie2');
var buttonThree = $('#movie3');
var buttonFour = $('#movie4');
var thisRound;
var thisTimer;
var thisScore;

//Start Game Function
$("#start").click(startGame);

function startGame(){
	$(".overlay").addClass("hide");
	$("#main-content").removeClass("hide");
	//Start the Round
	thisRound = new Round(videoOne.url, videoOne.movieName, videoOne.wrongNameOne, videoOne.wrongNameTwo, videoOne.wrongNameThree).start();
	//Start the Timer
	thisTimer = new Timer(30);
	thisTimer.applyTimer();
	//Start the Scoring
	thisScore = new Score(300);
	thisScore.applyScorer();
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
		timer.attr('class', 'big');
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
	},
	stopInterval: function(){
		window.clearInterval(this.timeInterval);
		this.finalTime = this.time;
		console.log(this.finalTime);
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
		scorer.attr('class', 'big');
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
		console.log(this.finalScore);
	},
	loserScore: function(){
		//Set Score to 0
		this.score = 0;
		//Empty Score Display
		this.scoreDisplay.empty();
		//Re-Add Headline
		var headline = $("<h6>");
		headline.html('Score:');
		this.scoreDisplay.append(headline);
		//Add New Score Display of 0
		var scorer = $("<p>");
		scorer.addClass('big');
		scorer.addClass('red');
		scorer.html(this.score);
		this.scoreDisplay.append(scorer);
	}
};

//Answer Functions
function addWinner(){
	thisTimer.stopInterval();
	thisScore.stopInterval();
}

function addLoser(){
	thisTimer.stopInterval();
	thisScore.stopInterval();
	thisScore.loserScore();
}
