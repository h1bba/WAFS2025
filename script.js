


// bron voor logica https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector


// CHATGPT prompt: ik wil graag dat wanneer de gebruiker klikt op een card-container dat de front onzichtbaar wordt en de back zichtbaar, alleen momenteel als hij de classList toggle doet, wilt hij niet de property overwriten

const cards = document.querySelectorAll(".container-card");


document.addEventListener("DOMContentLoaded", () => {

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const front = card.querySelector(".container-front");
            const back = card.querySelector(".container-back");

            if (front.style.display === "none") {
                front.style.display = "flex";
                back.style.display = "none";
            } else {
                front.style.display = "none";
                back.style.display = "flex";
            }
        });
    });
});

// fetch template van https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch



// Hulp van ChatGPT gekregen, prompt: ChatGPT, help mij met het gebruiken van deze public api (https://api.binance.com/api/v3/ticker/price)
// Functie om crypto prijzen op te halen en bij te werken
async function fetchCryptoPrices() {
    // Lijst met de crypto tickers, in de api worden ze symbols genoemd
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT'];

    // ID's van de HTML-elementen waarin we de prijs tonen
    const ids = ['btc', 'eth', 'sol', 'doge'];

    try {
        // Haal de prijsgegevens op via de Binance API
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');

        // De variable data is het JSON antwoord
        const data = await response.json();

        // Loop door de lijst met symbolen en update de bijbehorende HTML elementen
        symbols.forEach((symbol, index) => {
            // Zoek de juiste crypto in de API data
            // prompt: CHATGPT: how would i pare the symbols and ids
            const cryptoData = data.find(item => item.symbol === symbol);

            // Controleer of de prijs bestaat en toon deze
            if (cryptoData) {
                // Verwijdert 'USDT' uit de naam
                const coinName = symbol.replace('USDT', '');
                // Zet de prijs om naar 2 decimalen
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
                const price = Number(cryptoData.price).toFixed(2);
                // Replace de HTML contents met de crypto coin naam - de "USDT" en stopt de prijs er achter 
                document.getElementById(ids[index]).textContent = `${coinName}: $${price}`;
            }
        });
    } catch (error) {
        // Toon een foutmelding in de console als het misgaat
        console.error('Prijzen kunnen niet geladen worden', error);
    }
}

// Roep de functie 1 keer aan bij het laden van de pagina
fetchCryptoPrices();

// interval/timeout om de prijzen elke 10 seconden bij te refreshen
setInterval(fetchCryptoPrices, 10000);




// Selecteer de speler correct
const player = document.querySelector(".player");

player.style.position = "absolute"; // Zorgt dat offset van "left" werkt
let positionX = 0; // Startpositie
let positionY = 0; // Startpositie
let isJumping = false; // Voorkomt dubbele sprongen
let isFacingRight = true;
let isWalking = false;
let screenQuarter = 1; // Voor het berekenen van welke kaart open moet

// de offset is nodig om de kwart waar de speler zich in bevindt uit te rekenen
const playerPosition = player.offsetLeft;
const screenWidth = window.innerWidth;


const normalImage = "/images/UfukStanding.png";
const jumpImage = "/images/UfukJumping.png";



const step = 10; // Hoeveel pixels per toetsdruk

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        // Beweeg naar links
        positionX -= step;


        if (isFacingRight) {
            player.style.transform = "scaleX(-1)"; // Spiegel de afbeelding
            isFacingRight = false; // Speler kijkt nu naar links
        }
        isWalking = true;
        player.src = "images/UfukWalking.gif"
    }

    if (event.key === "ArrowRight") {
        // Beweeg naar rechts
        positionX += step;

        if (!isFacingRight) {
            player.style.transform = "scaleX(1)"; // Zet de afbeelding weer normaal
            isFacingRight = true; // Speler kijkt nu naar rechts
        }
        isWalking = true;
        player.src = "images/UfukWalking.gif"

    }
    if (event.key === "ArrowUp" && !isJumping) {
        player.src = jumpImage;
        player.classList.toggle("marioJumpAni");

        console.log(positionX);


        if (positionX < screenWidth / 4) {
            // eerste kwart
            screenQuarter = 1;
        } else if (positionX < (screenWidth / 4) * 2) {
            // tweede kwart
            screenQuarter = 2;
        } else if (positionX < (screenWidth / 4) * 3) {
            // derde kwart
            screenQuarter = 3;
        } else {
            // vierde kwart
            screenQuarter = 4;
        }

        console.log(screenQuarter);


        let cardIndex = screenQuarter - 1;


        // kaarten displayen aan de hand van de quarter waar de speler zich bevindt.
        cards.forEach((card, index) => {
            const front = card.querySelector(".container-front");
            const back = card.querySelector(".container-back");
            if (index === cardIndex) {
                setTimeout(() => {

                    front.style.display = "none";
                    back.style.display = "flex";
                }, 100);
                // set timeout gebruik https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
                setTimeout(() => {
                    card.classList.add('shakeAni');

                }, 100);
            }
        });

        isJumping = true; // Zet de sprong op actief

    }

    // Luister naar het einde van de animatie voordat hij opnieuw gebruikt kan worden
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event
    player.addEventListener("animationend", function () {
        player.classList.remove("marioJumpAni");
        isJumping = false; // animation reset
    });

    player.style.left = positionX + "px"; // Pas de positie toe

    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp") {
            isWalking = false;
            isJumping = false
            player.src = "images/UfukStanding.png"; // Change back to standing image
        }
    });

});



// Mobiel

let translateXValue = 0; // nodig voor het "swipen" van de kaarten

const vorigeButton = document.getElementById('vorige');
const volgendeButton = document.getElementById('volgende');
const jumpButton = document.getElementById('jump');
const sectionCards = document.getElementsByClassName('cards')[0]; // [0] van CHATGPT: "i get the error sectionCards is undefined", 0 i voor de index wat nodig is om de kaarten te offsetten

vorigeButton.addEventListener('click', function () {
    if (screenQuarter === 1) {
        return;
    } else {
        screenQuarter -= 1;
        translateXValue += 352; //20em + de 32px voor gap
        sectionCards.style.transform = `translateX(${translateXValue}px)`;
    }
});

volgendeButton.addEventListener('click', function () {
    if (screenQuarter === 4) {
        return;
    } else {
        screenQuarter += 1;
        translateXValue -= 352;
        sectionCards.style.transform = `translateX(${translateXValue}px)`;
    }
});

jumpButton.addEventListener('click', function () {
    player.src = jumpImage;
    player.classList.toggle("marioJumpAni");

    player.addEventListener("animationend", function () {
        player.classList.remove("marioJumpAni");
        isJumping = false; // zodat de animatie weer kan resetten
        player.src = "images/UfukStanding.png"; // reset image
    });

    let cardIndex = screenQuarter - 1;


    // kaarten displayen aan de hand van de quarter waar de speler zich bevindt.
    cards.forEach((card, index) => {
        const front = card.querySelector(".container-front");
        const back = card.querySelector(".container-back");
        if (index === cardIndex) {
            setTimeout(() => {

                front.style.display = "none";
                back.style.display = "flex";
            }, 100);
            // set timeout gebruik https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
            setTimeout(() => {
                card.classList.add('shakeAni');

            }, 100);
        }
    });


});

