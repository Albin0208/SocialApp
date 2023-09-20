/**
 * Initializes the app by fetching the tweets from the server and rendering them in the UI.
 * @returns {void}
 */
function initializeApp() {
  getTweets()
    .then(tweets => {
      renderTweets(tweets);
      initializeTweetForm();
    })
    .catch(error => {
      displayError("Error fetching tweets:", error);
    });
}

/**
 * Renders the tweets in the UI.
 * @param {Array} tweets - An array of tweet objects.
 * @returns {void}
 */
function renderTweets(tweets) {
  const tweetFeed = document.getElementById("tweet_feed");
  tweets.forEach(tweet => {
    const card = createTweetCard(tweet);
    tweetFeed.appendChild(card);
  });
}

/**
  * Unescapes HTML characters in a string.
  * @param {string} html - The string to unescape.
  * @returns {string} The escaped string.
  * 
  * @example
  * unescapeHTML("&lt;script&gt;alert(&#39;hello world&#39;)&lt;/script&gt;");
  *  => "<script>alert('hello world')</script>"
*/
function unescapeHTML(html) {
  var unescapeEl = document.createElement("textarea");
  unescapeEl.innerHTML = html;
  return unescapeEl.textContent;
}

/**
 * Initializes the tweet form and adds a submit event listener.
 * When the form is submitted, the tweet is posted to the server.
 * If the tweet is successfully posted, the page is reloaded.
 * If the tweet is not successfully posted, an error is displayed.
 * @returns {void}
 */
function initializeTweetForm() {
  const form = document.getElementById("tweet_form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const tweet = document.getElementById("tweet");
    if (!tweet.value || tweet.value.length > 140) {
      displayError(
        "Tweet is too long or too short! Maximum 140 characters, minimum 1 character."
      );
      return;
    }

    try {
      await postTweet(tweet.value);
      //location.reload();
    } catch (error) {
      displayError("Error posting tweet:", error);
    }
  });
}

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 * @param {Error} error - The error object.
 * @returns {void}
 */
function displayError(message, error) {
  console.error(message, error);
  const error_field = document.getElementById("tweet_error");
  error_field.textContent = message;
}

/**
 * Fetches the tweets from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of tweet objects.
 * @throws {Error} An error is thrown if the request fails.
 */
async function getTweets() {
  try {
    const response = await fetch("http://localhost:5000/messages");
    const data = await response.json();
    return data.data.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  return `${date.toISOString().substring(0, 10)} ${date.toLocaleTimeString(
    "se-SE",
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Stockholm",
      hour12: false,
    }
  )}`;
}

/**
 * Creates a tweet card element.
 * @param {Object} tweet - A tweet object.
 * @returns {HTMLDivElement} A tweet card element.
 */
function createTweetCard(tweet) {
  const cardDiv = document.createElement("div");
  cardDiv.id = tweet._id;
  cardDiv.classList.add("card", "text-center", "mb-4");
  if (tweet.read) {
    cardDiv.classList.add("bg-info");
  }

  const headerDiv = document.createElement("div");
  headerDiv.classList.add("card-header");

  const titleParagraph = document.createElement("p");
  titleParagraph.classList.add("text-muted", "m-0");
  titleParagraph.textContent = unescapeHTML(tweet.author); // Using textContent instead of innerHTML to prevent XSS

  headerDiv.appendChild(titleParagraph);

  const bodyDiv = document.createElement("div");
  bodyDiv.classList.add("card-body", "row");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("col-11");

  const contentParagraph = document.createElement("p");
  contentParagraph.classList.add("card-text");
  contentParagraph.textContent = unescapeHTML(tweet.message);

  contentDiv.appendChild(contentParagraph);

  const checkboxDiv = document.createElement("div");
  checkboxDiv.classList.add("col-1");

  const checkboxInput = document.createElement("input");
  checkboxInput.classList.add("form-check-input");
  checkboxInput.type = "checkbox";
  checkboxInput.value = "";
  checkboxInput.addEventListener("change", readTweet, tweet.id);
  checkboxInput.id = tweet._id + "checkbox";
  checkboxInput.checked = tweet.read;

  checkboxDiv.appendChild(checkboxInput);

  bodyDiv.appendChild(contentDiv);
  bodyDiv.appendChild(checkboxDiv);

  const footerDiv = document.createElement("div");
  footerDiv.classList.add("card-footer", "text-muted");
  footerDiv.textContent = `Posted at ${formatDate(tweet.timestamp)}`;

  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(bodyDiv);
  cardDiv.appendChild(footerDiv);

  return cardDiv;
}

function updateTweets(tweets) {
  document.cookie = "tweets=" + JSON.stringify(tweets);
}

function readTweet(event) {
  const id = event.target.id.replace("checkbox", "");

  if (!event.target.checked) {
    document.getElementById(id).classList.remove("bg-info");
  } else document.getElementById(id).classList.add("bg-info");

  tweets = getTweets();
  tweets.map(tweet => {
    if (tweet.id == event.target.id.replace("checkbox", "")) {
      tweet.read = !tweet.read;
      updateTweets(tweets);
      return;
    }
  });
}

function postTweet(message) {
  const tweet = {
    message: message,
    author: "Anonymous",
    timestamp: Date.now(),
    read: false,
  }

  fetch('http://localhost:5000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweet),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const tweetFeed = document.getElementById("tweet_feed");
      const card = createTweetCard({ id: data.data.id, ...tweet});
      tweetFeed.prepend(card);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

window.onload = initializeApp;
