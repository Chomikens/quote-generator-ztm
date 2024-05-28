/**
 * Button to trigger fetching and displaying a new quote.
 * @type {HTMLElement}
 */
const newQuoteButton = document.querySelector("#new-quote");

/**
 * Button to trigger tweeting the current quote.
 * @type {HTMLElement}
 */
const twitterButton = document.querySelector("#twitter");

/**
 * Loader container - switch between fetching.
 * @type {HTMLElement}
 */
const loader = document.querySelector("#loader");

/**
 * Container for displaying the quote.
 * @type {HTMLElement}
 */
const quoteContainer = document.querySelector('#quote-container');

/**
 * Supporting Functions
 */

/**
 * Hides the loader and displays the quote container.
 */
function hideLoader() {
    quoteContainer.style.display = "none";
    loader.classList.add('loader-shown');
}

/**
 * Shows the loader and hides the quote container.
 */
function showLoader() {
    quoteContainer.style.display = "block";
    loader.classList.remove('loader-shown');
}

/**
 * Generates a random integer between min (inclusive) and max (exclusive).
 * @param {number} max - The upper bound (exclusive).
 * @param {number} [min=0] - The lower bound (inclusive).
 * @returns {number} A random integer between min and max.
 */
function getRandomNumber(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Fetches data from the quotes API.
 * @async
 * @returns {Promise<Object[]>} A promise that resolves to an array of quote objects.
 * @throws Will throw an error if the fetch operation fails.
 */
async function getQuoteFromAPI() {
    const url = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
    try {
        hideLoader();
        const response = await fetch(url);
        if (!response.ok) throw new Error("Unable to fetch data");
        return await response.json();
    } catch (error) {
        console.log(error.message);
        return []; // Return an empty array in case of error
    }
}

/**
 * Fetches a single random quote from the API data.
 * @async
 * @returns {Promise<{text: string, author: string, quoteLength: number}>} 
 * A promise that resolves to an object containing the quote text, author, and length.
 * @throws Will throw an error if the data length is zero or if fetching data fails.
 */
async function getSingleQuote() {
    try {
        const data = await getQuoteFromAPI();
        if (data.length === 0) throw new Error("There was a problem with the data");
        const randomIndex = getRandomNumber(data.length);
        const { text, author } = data[randomIndex];

        return {
            text,
            author,
            quoteLength: text.length,
        };
    } catch (error) {
        console.log(error.message);
        return {
            text: "An error occurred. Please try again.",
            author: "System",
            quoteLength: 0,
        };
    }
}

/**
 * Main Functions
 */

/**
 * Fetches a single random quote and updates the DOM to display it.
 * @async
 * @returns {Promise<void>}
 */
async function renderText() {
    try {
        const quote = await getSingleQuote();
        const quoteTextContainer = document.querySelector("#quote-text");
        const quoteAuthorContainer = document.querySelector("#author");

        if (quote.quoteLength > 120) {
            quoteTextContainer.classList.add('quote-text-long');
        } else {
            quoteTextContainer.classList.remove('quote-text-long');
        }

        showLoader();
        quoteTextContainer.textContent = quote.text;
        quoteAuthorContainer.textContent = quote.author;
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Handles the Tweet button click event by fetching a quote and opening a Twitter intent URL to tweet the quote.
 * @async
 * @returns {Promise<void>}
 */
async function handleTweet() {
    try {
        const quote = await getSingleQuote();
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote.text)} - ${encodeURIComponent(quote.author)}`;
        window.open(twitterUrl, '_blank');
    } catch (error) {
        console.log("Error tweeting the quote:", error.message);
    }
}

// Add an event listener to fetch and display a new quote when the button is clicked.
newQuoteButton.addEventListener("click", renderText);

// Add an event listener to tweet the current quote when the button is clicked.
twitterButton.addEventListener("click", handleTweet);
