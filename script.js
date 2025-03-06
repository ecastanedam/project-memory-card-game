const splashScreen = document.getElementById("splash-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameBoard = document.querySelector(".game-board"); // finds and element by the CSS selector class

const flipSound = new Audio("sounds/woosh.mp3");
const winSound = new Audio("sounds/winner.mp3");
winSound.volume = 0.5;

const loseSound = new Audio("sounds/gameOver.mp3");
loseSound.volume = 0.5;

const backGroundMusic = new Audio("sounds/Cosmic Drift - DivKid.mp3");
backGroundMusic.loop = true;
backGroundMusic.volume = 0.1;

function playBackGroundMusic() {
  backGroundMusic.play();
}

let timeLimit = 100;
let timeLeft = timeLimit;
let timerInterval;
const timerDisplay = document.createElement("div");
timerDisplay.id = "timer";
timerDisplay.textContent = `Time: ${timeLeft}`;
gameScreen.appendChild(timerDisplay);

function startTimer() {
  timeLeft = timeLimit; // resets timeLeft to the original timeLimit
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`; // updates display
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      loseGame();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loseGame() {
  alert("Time's Up! Try again!");
  gameScreen.style.display = "none";
  gameOverScreen.style.display = "block";
  loseSound.play();
}

// class for creating new game objects

class MemoryGame {
  constructor(gameBoardElement) {
    this.board = gameBoardElement; //stores the game board element
    this.cardsData = [
      // array of card data, name and image
      { name: "one", img: "one.jpg" },
      { name: "two", img: "two.jpg" },
      { name: "three", img: "three.jpg" },
      { name: "four", img: "four.jpg" },
      { name: "five", img: "five.jpg" },
      { name: "six", img: "six.jpg" },
      { name: "seven", img: "seven.jpg" },
      { name: "eight", img: "eight.jpg" },
      { name: "nine", img: "nine.jpg" },
      { name: "ten", img: "ten.jpg" },
      { name: "one", img: "one.jpg" },
      { name: "two", img: "two.jpg" },
      { name: "three", img: "three.jpg" },
      { name: "four", img: "four.jpg" },
      { name: "five", img: "five.jpg" },
      { name: "six", img: "six.jpg" },
      { name: "seven", img: "seven.jpg" },
      { name: "eight", img: "eight.jpg" },
      { name: "nine", img: "nine.jpg" },
      { name: "ten", img: "ten.jpg" },
    ];

    this.cards = []; // array to store card elements
    this.flippedCards = []; // array to store the flipped cards
    this.shuffleCards(); //method to shuffle the card data
    this.createCards(); //method to create card elements and add them to the game board
    this.score = 0; // initialize the score
    this.scoreDisplay = document.getElementById("score"); //stores the score display element
    this.moveCount = 0;
    this.createMoveCounterDisplay();
  }

  createMoveCounterDisplay() {
    this.moveCounterDisplay = document.createElement("div");
    this.moveCounterDisplay.id = "move-counter";
    this.moveCounterDisplay.textContent = "Moves: 0";
    gameScreen.appendChild(this.moveCounterDisplay);
  }

  incrementMoveCount() {
    this.moveCount++;
    this.moveCounterDisplay.textContent = `Moves: ${this.moveCount}`;
  }

  // shuffles the card data
  shuffleCards() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cardsData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // generates a random index
      [this.cardsData[i], this.cardsData[j]] = [
        this.cardsData[j],
        this.cardsData[i],
      ];
    }
  }
  //method to create card elements and add them to the game board
  createCards() {
    this.cardsData.forEach((cardData, index) => {
      const card = document.createElement("div"); // creates a div for the card
      card.classList.add("card"); // adds class "card" to the card div for styling
      card.dataset.index = index; // stores card index as attribute
      card.dataset.name = cardData.name; // stores card name as attribute

      const cardInner = document.createElement("div"); // contains front and back sides
      cardInner.classList.add("card-inner");

      const cardFront = document.createElement("div");
      cardFront.classList.add("front");
      const img = document.createElement("img");
      img.src = `img/${cardData.img}`;
      img.classList.add("card-image");
      cardFront.appendChild(img);

      const cardBack = document.createElement("div");
      cardBack.classList.add("back");

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      card.addEventListener("click", () => this.flipCard(card)); // adds a click event listener
      this.board.appendChild(card); // add the card to the game board
      this.cards.push(card); // adds the card to the cards array
    });
  }

  flipCard(card) {
    if (
      this.flippedCards.length < 2 &&
      !card.classList.contains("turned") &&
      !card.classList.contains("matched")
    ) {
      card.classList.add("turned"); // adds the class "turned" to the clicked card div
      this.flippedCards.push(card); //add the clicked card div to the flippedCards array
      this.incrementMoveCount();
      flipSound.play(); // plays woosh sound
      if (this.flippedCards.length === 2) {
        // checks if two cards have been flipped
        this.checkForMatch(); //calls the checkForMatch method to check if the cards match
      }
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards; // getthe two flipped cards
    if (card1.dataset.name === card2.dataset.name) {
      //if the cards match
      card1.classList.add("matched"); //adds the class "matched" to each card
      card2.classList.add("matched"); //adds the class "matched" to each card
      card1.classList.add("animate"); // adds "animate" class
      card2.classList.add("animate");

      this.flippedCards = []; // clears the flipped cards array
      this.checkWin(); //checks if the player has won
      this.updateScore(10); // updates the score
      setTimeout(() => {
        card1.classList.remove("animate");
        card2.classList.remove("animate");
      }, 1500);
    } else {
      // if the cards don't match
      setTimeout(() => {
        // wait for 1 second or 1000 milliseconds
        card1.classList.remove("turned"); // removes the class "flipped"
        card2.classList.remove("turned"); // removes the class "flipped"
        this.flippedCards = []; //clear the flipped cards array
      }, 1000);
    }
  }

  checkWin() {
    let matchedCount = 0; // initialize couner for matched cards
    for (let i = 0; i < this.cards.length; i++) {
      // loops through all cards
      if (this.cards[i].classList.contains("matched")) {
        matchedCount++; // increments the counter if the card is matched
      }
    }
    // check if all cards are matched
    if (matchedCount === this.cards.length) {
      alert("Nicely Done!"); // shows an alert message when all cards are matched
      gameScreen.style.display = "none";
      gameOverScreen.style.display = "block";
      stopTimer();
      winSound.play();
    }
  }

  updateScore(points) {
    console.log("updateScore called with points:", points);
    this.score += points;
    this.scoreDisplay.textContent = `Score: ${this.score}`;
  }
}

//hides all images initially
const allImages = document.querySelectorAll(".card-image");
allImages.forEach((img) => (img.style.display = "none"));

//hides game and game over screens initially
gameScreen.style.display = "none";
gameOverScreen.style.display = "none";

//adds event listener to start button
startButton.addEventListener("click", () => {
  splashScreen.style.display = "none";
  gameScreen.style.display = "block";
  const game = new MemoryGame(gameBoard);
  game.updateScore(0);
  playBackGroundMusic();
  startTimer();
});

// add event listener to restart button
restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameBoard.innerHTML = "";
  const game = new MemoryGame(gameBoard);
  game.updateScore(0);
  playBackGroundMusic();
  game.moveCount = 0; //resets move count
  game.moveCounterDisplay.textContent = "Moves: 0";
  stopTimer();
  startTimer();
});
