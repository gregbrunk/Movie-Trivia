var videoOne = {
	url: "http://www.youtube.com/embed/7UpRNOkb4hw?modestbranding=1&autoplay=1&controls=0&fs=0&rel=0&showinfo=0&disablekb=1",
	movieName: "Blades of Glory",
	wrongNameOne: "Braids of Glory",
	wrongNameTwo: "Anchorman",
	wrongNameThree: "Poopy The Pirate King",
	shuffledAnswers: [],
};

function setVideo() {
	var currentUrl = videoOne.url;
	var video = $('#video-frame');
	video.attr('src', currentUrl);
	console.log(currentUrl);
	console.log(video);
}
setVideo();

function randomizeAnswers(array) {
    var j, x;
    for(var i = array.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
    videoOne.shuffledAnswers = array;
}

var orderedAnswers = [videoOne.movieName,videoOne.wrongNameOne,videoOne.wrongNameTwo,videoOne.wrongNameThree];
randomizeAnswers(orderedAnswers);
console.log(orderedAnswers);
console.log(videoOne.shuffledAnswers);

function setButtons() {
	var buttonOne = $('#movie1');
	var buttonTwo = $('#movie2');
	var buttonThree = $('#movie3');
	var buttonFour = $('#movie4');
	buttonOne.html(videoOne.shuffledAnswers[0]);
	buttonTwo.html(videoOne.shuffledAnswers[1]);
	buttonThree.html(videoOne.shuffledAnswers[2]);
	buttonFour.html(videoOne.shuffledAnswers[3]);
}
setButtons();