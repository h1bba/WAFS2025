async function getData() {
    const url = "https://fdnd.directus.app/items/person/?filter={%22id%22:226}";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}


// bron voor logica https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector

let cardInfo = document.querySelector("section.container-back");
let cardMystery = document.querySelector("section.container-front");
let cardInside = document.querySelector("article").addEventListener("click", () => {
    cardInfo.classList.toggle("display");
    cardMystery.classList.toggle("hide");
});