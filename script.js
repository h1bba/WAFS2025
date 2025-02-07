


// bron voor logica https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector

// let cardInfo = document.querySelector("section.container-back");
// let cardMystery = document.querySelector("section.container-front");
// let cardInside = document.querySelector("article").addEventListener("click", () => {
//     cardInfo.classList.toggle("display");
//     cardMystery.classList.toggle("hide");
// });

// CHATGPT prompt: ik wil graag dat wanneer de gebruiker klikt op een card-container dat de front onzichtbaar wordt en de back zichtbaar, alleen momenteel als hij de classList toggle doet, wilt hij niet de property overwriten

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".container-card");

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
            const cryptoData = data.find(item => item.symbol === symbol);

            // Controleer of de prijs bestaat en toon deze
            if (cryptoData) {
                // Verwijdert 'USDT' uit de naam
                const coinName = symbol.replace('USDT', '');
                // Zet de prijs om naar 2 decimalen
                const price = Number(cryptoData.price).toFixed(2);
                // Replace de HTML contents met de crypto coin naam - de "USDT" en stopt de prijs er achter 
                document.getElementById(ids[index]).textContent = `${coinName}: $${price}`;
            }
        });
    } catch (error) {
        // Toon een foutmelding in de console als het misgaat
        console.error('Fout bij het ophalen van crypto prijzen:', error);
    }
}

// Roep de functie 1 keer aan bij het laden van de pagina
fetchCryptoPrices();

// Stel een interval in om de prijzen elke 10 seconden bij te werken
setInterval(fetchCryptoPrices, 10000);




// Selecteer de speler correct
const player = document.querySelector(".player");

// Zorg ervoor dat de speler een geldige `left`-waarde heeft
player.style.position = "absolute"; // Zorg dat 'left' werkt
let positionX = 0; // Startpositie
let positionY = 0; // Startpositie
let isJumping = false; // Voorkomt dubbele sprongen
let isFacingRight = true;

const normalImage = "/images/MarioStanding.png";
const jumpImage = "/images/MarioJumping.png";



const step = 10; // Hoeveel pixels per toetsdruk

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        // Beweeg naar links
        positionX -= step;
        if (isFacingRight) {
            player.style.transform = "scaleX(-1)"; // Spiegel de afbeelding
            isFacingRight = false; // Speler kijkt nu naar links
        }
    }

    if (event.key === "ArrowRight") {
        // Beweeg naar rechts
        positionX += step;
        if (!isFacingRight) {
            player.style.transform = "scaleX(1)"; // Zet de afbeelding weer normaal
            isFacingRight = true; // Speler kijkt nu naar rechts
        }


    }
    if (event.key === "ArrowUp" && !isJumping) {
        player.src = jumpImage;
        // player.classList.toggle("marioJumpAni");
        isJumping = true; // Zet de sprong op actief
        positionY += step * 15;
        player.style.bottom = positionY + "px"; // Pas de positie toe

    }


    player.style.left = positionX + "px"; // Pas de positie toe


    //css class voor de jump 
    // playerJump = player.querySelector("marioJumpAni");
    // player.addEventListener("animationend", isJumping = false);

    // Zorg dat de speler na 300ms weer terugkeert naar de originele positie
    setTimeout(() => {
        player.src = normalImage;
        // player.classList.toggle("marioJumpAni");
        positionY = 46; // Terug naar standaard Y-positie
        player.style.bottom = positionY + "px";
    }, 150);
    isJumping = false;

});