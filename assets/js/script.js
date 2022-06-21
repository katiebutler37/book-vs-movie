// True for mockpayloads/auto-search, False for real fetching and normal app behaviour 
const DEBUG = false;

// Our Movie card variables which will hold the fetched data
var movieCover = document.querySelector(".movie-cover");
var movieTitle = document.querySelector(".movie-title");
var movieRating = document.querySelector(".movie-rating");
var movieDescription = document.querySelector(".movie-description");

// HTML elements related to books 
var bookCover = document.querySelector(".book-cover");
var bookTitle = document.querySelector(".book-title");
var bookRating = document.querySelector(".book-rating");
var bookDescription = document.querySelector(".book-description");

var titleInputEl = document.querySelector("#title");
var searchFormEl = document.querySelector(".search-form");
var searchedTitleEl = document.querySelector("#searched-title");
var resultsContainerEl = document.querySelector("#results");
var searchHistoryContainerEl = document.querySelector('.search-history-items')


const movieOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fc6b69c0damshf39a0c0e95d5241p10963bjsn7774c35cda52',
		'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
	}
};

function errorNoMatch() {
    console.log("search error");
    $("#search-error").addClass("is-active");
};

function errorNoConnection() {
    $("#server-error").addClass("is-active");
};

var closeModal = function (event) {
    event.preventDefault();
    $(".modal").removeClass("is-active");
};

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
    
    // get value from input element
    var title = titleInputEl.value.trim();
    
    if (title) {
        // display the columns
        showDisplay();
        //pass title to be fetched
        searchTitle(title);
    } else {
        //triggers an error modal
        errorNoMatch();
    } 
};

var buttonClickHandler = function(event) {
    //grab text from button clicked and give it back to original fetch function
    var searchedTitle = event.target.textContent;
    titleInputEl.value = searchedTitle;
    searchTitle(searchedTitle);
    showDisplay();
};

async function fetchMovieData(title) {

    try {
        let initialResponse = await fetch(`https://movie-database-alternative.p.rapidapi.com/?s=${title}&r=json&page=1`, movieOptions);
        let initialData = await initialResponse.json();

        let finalResponse = await fetch(`https://movie-database-alternative.p.rapidapi.com/?r=json&i=${initialData.Search[0].imdbID}`, movieOptions);
        let finalData = await finalResponse.json();
    
        return finalData;
    }
    catch(err) {
        if (err.message === "Failed to fetch") {
            errorNoConnection();
        }
        else {
            errorNoMatch();
        }
    }
}

async function fetchBookData(title) {
    
    try {
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
        let data = await response.json();
    
        return data.items[0].volumeInfo;
    }
    catch(err) {
        if (err.message === "Failed to fetch") {
            errorNoConnection();
        }
        else {
            errorNoMatch();
        }
    }
     
}

function searchTitle(title) {

    if (DEBUG) {
        // Do stuff with mock payloads
        movieResults(moviePayload);
        bookResults(bookPayload);
        displayResultsTitle();
    }
    else {
        // Do stuff with real payloads in sequence
        fetchMovieData(title)
            .then((data) => movieResults(data))
            .then((data) => { // 'data' here is the movie data, ready to be fed into the book fetching below, if desired 
                fetchBookData(title)
                .then((data) => bookResults(data))
            })
            .then(() => displayResultsTitle())
    }

}

var displayResultsTitle = function (){
    //clear old display content
    resultsContainerEl.innerHTML = "";

    // get value from input element
    var title = titleInputEl.value.trim();

    var titleArray = title.split(" ");
    for (var i=0; i < titleArray.length; i++) {
        titleArray[i] = titleArray[i].charAt(0).toUpperCase() + titleArray[i].slice(1).toLowerCase()
    };
    var displayTitle = titleArray.join(" ");

    searchedTitleEl.innerHTML = "Displaying results for: " + displayTitle;
    resultsContainerEl.appendChild(searchedTitleEl);

   //may want load local storage array, push into array, and set updated search history array to local storage here

   //dynamically create save button here, add the necessary styling classes and also append to the results container
   var saveReviewButtonEl = document.createElement("button");
   saveReviewButtonEl.classList = "button is-success is-responsive is-rounded is-medium";
   saveReviewButtonEl.setAttribute("id", "save-btn");
   saveReviewButtonEl.innerHTML = "<i class='fa-solid fa-check'></i>Save Review";
   //append to results container
   resultsContainerEl.appendChild(saveReviewButtonEl);

    //load searchedCities (an array) from localStorage and turn strings back to objects
    var searchedTitles = JSON.parse(localStorage.getItem("searched-titles")) || [];
    //add the individal cityTitle item to the array of searched cities
    searchedTitles.push(displayTitle);
    //add updated array to local storage
    localStorage.setItem("searched-titles", JSON.stringify(searchedTitles));
    displaySearchHistory();

    //clear old input from form
    titleInputEl.value = "";
}


var movieResults = function (results){
    movieCover.setAttribute("src", results.Poster);
    movieTitle.textContent = results.Title;
    movieDescription.textContent = results.Plot;
    
    // this is our Star rating system based on the MetaScore
    if (results.Metascore <= 20){
        movieRating.textContent = "⭐";
    }
  
    if (0 <= results.Metascore && results.Metascore <= 10){
        movieRating.innerHTML = "<i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (10 < results.Metascore && results.Metascore <= 20){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (20 < results.Metascore && results.Metascore <= 30){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (30 < results.Metascore && results.Metascore <= 40){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (40 < results.Metascore && results.Metascore <= 50){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (50 < results.Metascore && results.Metascore <= 60){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (60 < results.Metascore && results.Metascore <= 70){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i>";
    }
    if (70 < results.Metascore && results.Metascore <= 80){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (80 < results.Metascore && results.Metascore <= 90){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i>";
    }
    if (90 < results.Metascore && results.Metascore <= 100){
        movieRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i>";
    }
    
    return results;

}

var bookResults = function (results){
    bookCover.setAttribute("src", results.imageLinks.thumbnail);
    bookTitle.textContent = results.title;
    bookDescription.textContent = results.description;

    // round to nearest integer
    const rating = results.averageRating;
    
    if (0 <= rating && rating <= 0.5){
        bookRating.innerHTML = "<i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (0.5 < rating && rating <= 1){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (1 < rating && rating <= 1.5){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (1.5 < rating && rating <= 2){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (2 < rating && rating <= 2.5){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (2.5 < rating && rating <= 3){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (3 < rating && rating <= 3.5){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i><i class='fa-regular fa-star'></i>";
    }
    if (3.5 < rating && rating <= 4){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-regular fa-star'></i>";
    }
    if (4 < rating && rating <= 4.5){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star-half-stroke'></i>";
    }
    if (4.5 < rating && rating <= 5){
        bookRating.innerHTML = "<i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i><i class='fa-solid fa-star'></i>";
    }
}

var displaySearchHistory = function() {
    if (localStorage.length > 0) {
       //grab stored array of searched cities from localStorage
       var searchedTitles = JSON.parse(localStorage.getItem("searched-titles"));
       //to sort from most-least recent (searched) changing the order of reading it
       var recentSearchedTitles = searchedTitles.reverse();
       //to remove any duplicates for final display version
       var filteredSearchedTitles = [...new Set(recentSearchedTitles)];

       //clear old display content
       searchHistoryContainerEl.innerHTML = "";

       //loop through searchedCities array to display array but...
       for (i=0; i < filteredSearchedTitles.length; i++) {
           //...stop at index 9 to keep only the most recent 10 showing
           if (i>=10) {
               break;
           }
           searchHistoryContainerEl.innerHTML += "<button class='button is-rounded search-history-item'>" + filteredSearchedTitles[i] + "</button>"
       };
   };
};

if (DEBUG) {
    searchTitle("A Clockwork Orange");
}

// show the columns display and reposition the footer when the search button is clicked
var showDisplay = function (){
    // reveal the columns display
    $(".columns").removeAttr('id');
   // reposition the footer
    $("footer").css("position", "relative");
    // and hide the placeholder "Search A Title"
    $(".onload-display").css("display", "none");
};

//displays on load of page
displaySearchHistory();

//add event listener to search history items
searchHistoryContainerEl.addEventListener("click", buttonClickHandler)

$(".modal-close").on("click", closeModal)
$(".modal-background").on("click", closeModal);

// add event listeners to forms
searchFormEl.addEventListener('submit', formSubmitHandler);
